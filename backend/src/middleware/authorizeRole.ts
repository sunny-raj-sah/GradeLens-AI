
import type { RequestHandler } from 'express'
import type { AuthenticatedRequest } from './authenticate.js'

type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT'

export function authorizeRole(...allowedRoles: UserRole[]): RequestHandler {
  return (req, res, next) => {
    const authRequest = req as AuthenticatedRequest

    if (!authRequest.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
      return
    }

    if (!allowedRoles.includes(authRequest.user.role)) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
      })
      return
    }

    next()
  }
}
