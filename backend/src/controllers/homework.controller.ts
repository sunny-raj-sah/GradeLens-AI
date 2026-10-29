
import type { RequestHandler } from 'express'
import { z } from 'zod'
import type { AuthenticatedRequest } from '../middleware/authenticate.js'
import prisma from '../lib/prisma.js'
import {
  createHomework,
  getHomeworkForClassroom,
    updateHomework,
  deleteHomework,
} from '../services/homework.service.js'

const createHomeworkSchema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().max(2000).optional(),
  dueDate: z.string().datetime().optional(),
  classroomId: z.string().trim().min(1),
})

export const addHomework: RequestHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest
    const input = createHomeworkSchema.parse(req.body)

    const classroom = await prisma.classroom.findUnique({
      where: { id: input.classroomId },
      select: { id: true, teacherId: true },
    })

    if (!classroom) {
      res.status(404).json({
        success: false,
        message: 'Classroom not found',
      })
      return
    }

    if (
      authReq.user!.role !== 'ADMIN' &&
      classroom.teacherId !== authReq.user!.userId
    ) {
      res.status(403).json({
        success: false,
        message: 'You cannot create homework for this classroom',
      })
      return
    }

    const homework = await createHomework({
      title: input.title,
      classroomId: input.classroomId,
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.dueDate !== undefined
        ? { dueDate: input.dueDate }
        : {}),
    })

    res.status(201).json({
      success: true,
      message: 'Homework created successfully',
      data: { homework },
    })
  } catch (error) {
    next(error)
  }
}

export const listHomework: RequestHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest
    const classroomId = z.string().trim().min(1).parse(req.params.classroomId)

    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
      select: { id: true, teacherId: true },
    })

    if (!classroom) {
      res.status(404).json({
        success: false,
        message: 'Classroom not found',
      })
      return
    }

    if (
      authReq.user!.role !== 'ADMIN' &&
      classroom.teacherId !== authReq.user!.userId
    ) {
      res.status(403).json({
        success: false,
        message: 'You cannot view homework for this classroom',
      })
      return
    }

    const homework = await getHomeworkForClassroom(classroomId)

    res.status(200).json({
      success: true,
      data: { homework },
    })
  } catch (error) {
    next(error)
  }
}
// --------------------------------------------------------

// new

const updateHomeworkSchema = z
  .object({
    title: z.string().trim().min(2).max(150).optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    dueDate: z.string().datetime().nullable().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.dueDate !== undefined,
    {
      message: 'At least one field must be provided for an update',
    },
  )

export const editHomework: RequestHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest
    const homeworkId = z.string().trim().min(1).parse(req.params.homeworkId)
    const input = updateHomeworkSchema.parse(req.body)

    const existingHomework = await prisma.homework.findUnique({
      where: { id: homeworkId },
      select: {
        id: true,
        classroom: {
          select: { teacherId: true },
        },
      },
    })

    if (!existingHomework) {
      res.status(404).json({
        success: false,
        message: 'Homework not found',
      })
      return
    }

    if (
      authReq.user!.role !== 'ADMIN' &&
      existingHomework.classroom.teacherId !== authReq.user!.userId
    ) {
      res.status(403).json({
        success: false,
        message: 'You cannot update homework for this classroom',
      })
      return
    }

    const homework = await updateHomework(homeworkId, {
      ...(input.title !== undefined
        ? { title: input.title }
        : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.dueDate !== undefined
        ? {
            dueDate:
              input.dueDate === null
                ? null
                : new Date(input.dueDate),
          }
        : {}),
    })

    res.status(200).json({
      success: true,
      message: 'Homework updated successfully',
      data: { homework },
    })
  } catch (error) {
    next(error)
  }
}

export const removeHomework: RequestHandler = async (req, res, next) => {
  try {
    const authReq = req as AuthenticatedRequest
    const homeworkId = z.string().trim().min(1).parse(req.params.homeworkId)

    const existingHomework = await prisma.homework.findUnique({
      where: { id: homeworkId },
      select: {
        id: true,
        classroom: {
          select: { teacherId: true },
        },
      },
    })

    if (!existingHomework) {
      res.status(404).json({
        success: false,
        message: 'Homework not found',
      })
      return
    }

    if (
      authReq.user!.role !== 'ADMIN' &&
      existingHomework.classroom.teacherId !== authReq.user!.userId
    ) {
      res.status(403).json({
        success: false,
        message: 'You cannot delete homework for this classroom',
      })
      return
    }

    await deleteHomework(homeworkId)

    res.status(200).json({
      success: true,
      message: 'Homework deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}
