import type { Response, NextFunction } from 'express'
import { z } from 'zod'
import type { AuthenticatedRequest } from '../middleware/authenticate.js'
import { askRoleAwareQuestion } from '../services/ai-assistant.service.js'
// import { askRoleAwareQuestion } from '../services/ai-assistant.service.js'

const questionSchema = z.object({
  classroomId: z.string().trim().min(1).optional(),
  question: z.string().trim().min(3).max(1000),
})

export async function askRoleAwareQuestionController(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
      return
    }

    const parsed = questionSchema.safeParse(req.body)

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid question data',
        errors: parsed.error.flatten(),
      })
      return
    }

    const result = await askRoleAwareQuestion({
      userId: req.user.userId,
      role: req.user.role,
      classroomId: parsed.data.classroomId,
      question: parsed.data.question,
    })

    res.status(200).json(result)
  } catch (error) {
    const statusCode =
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      typeof error.statusCode === 'number'
        ? error.statusCode
        : null

    if (statusCode === 403 || statusCode === 404) {
      res.status(statusCode).json({
        success: false,
        message:
          statusCode === 403
            ? 'You cannot access the requested classroom data'
            : 'Requested records were not found',
      })
      return
    }

    next(error)
  }
}