
import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/authenticate.js'
import { z } from 'zod'
import prisma from '../lib/prisma.js'
import { askAboutClassroom } from '../services/ai.service.js'

const questionSchema = z.object({
  classroomId: z.string().trim().min(1),
  question: z.string().trim().min(3).max(1000),
})

export async function askClassroomQuestion(
  req: AuthenticatedRequest,
  res: Response,
) {
  const parsed = questionSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid question data',
      errors: parsed.error.flatten(),
    })
  }

  const { classroomId, question } = parsed.data

  const classroom = await prisma.classroom.findUnique({
    where: { id: classroomId },
    select: {
      id: true,
      teacherId: true,
    },
  })

  if (!classroom) {
    return res.status(404).json({
      message: 'Classroom not found',
    })
  }

  if (
    req.user?.role !== 'ADMIN' &&
    classroom.teacherId !== req.user?.userId
  ) {
    return res.status(403).json({
      message: 'You cannot ask questions about this classroom',
    })
  }

  const result = await askAboutClassroom(classroomId, question)

  if (!result) {
    return res.status(404).json({
      message: 'Classroom analytics not found',
    })
  }

  return res.status(200).json(result)
}
