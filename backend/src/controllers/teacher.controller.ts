
import type { RequestHandler } from 'express'
import { z } from 'zod'
import {
  createTeacher,
  deleteTeacher,
  getTeacherById,
  getTeachers,
  updateTeacher,
} from '../services/teacher.service.js'

const createTeacherSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72),
})

const updateTeacherSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    email: z.string().trim().email().max(254).optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined || data.email !== undefined,
    { message: 'Provide at least one field to update' },
  )

export const listTeachers: RequestHandler = async (
  _req,
  res,
  next,
) => {
  try {
    const teachers = await getTeachers()

    res.status(200).json({
      success: true,
      data: { teachers },
    })
  } catch (error) {
    next(error)
  }
}

export const getTeacherDetails: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const teacherId = z
      .string()
      .trim()
      .min(1)
      .parse(req.params.teacherId)

    const teacher = await getTeacherById(teacherId)

    if (!teacher) {
      res.status(404).json({
        success: false,
        message: 'Teacher not found',
      })
      return
    }

    res.status(200).json({
      success: true,
      data: { teacher },
    })
  } catch (error) {
    next(error)
  }
}

export const addTeacher: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const input = createTeacherSchema.parse(req.body)
    const teacher = await createTeacher(input)

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: { teacher },
    })
  } catch (error) {
    next(error)
  }
}

export const editTeacher: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const teacherId = z
      .string()
      .trim()
      .min(1)
      .parse(req.params.teacherId)

    const input = updateTeacherSchema.parse(req.body)
    const teacher = await updateTeacher(teacherId, input)

    res.status(200).json({
      success: true,
      message: 'Teacher updated successfully',
      data: { teacher },
    })
  } catch (error) {
    next(error)
  }
}

export const removeTeacher: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const teacherId = z
      .string()
      .trim()
      .min(1)
      .parse(req.params.teacherId)

    const teacher = await deleteTeacher(teacherId)

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully',
      data: { teacher },
    })
  } catch (error) {
    next(error)
  }
}
