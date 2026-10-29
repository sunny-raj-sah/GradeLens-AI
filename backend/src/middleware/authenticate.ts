
import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt.js'

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    role: 'ADMIN' | 'TEACHER' | 'STUDENT'
  }
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authRequest = req as AuthenticatedRequest
  const authorization = req.headers.authorization

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
    return
  }

  const token = authorization.slice('Bearer '.length).trim()

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication token is missing',
    })
    return
  }

  try {
    authRequest.user = verifyAccessToken(token)
    next()
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
    })
  }
}
