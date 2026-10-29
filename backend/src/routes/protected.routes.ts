
import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { authorizeRole } from '../middleware/authorizeRole.js'

const router = Router()

router.get('/profile', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Authentication successful',
    user: (req as typeof req & {
      user?: { userId: string; role: string }
    }).user,
  })
})

router.get(
  '/admin',
  authenticate,
  authorizeRole('ADMIN'),
  (_req, res) => {
    res.json({
      success: true,
      message: 'Admin access granted',
    })
  },
)

router.get(
  '/teacher',
  authenticate,
  authorizeRole('ADMIN', 'TEACHER'),
  (_req, res) => {
    res.json({
      success: true,
      message: 'Teacher access granted',
    })
  },
)

export default router
