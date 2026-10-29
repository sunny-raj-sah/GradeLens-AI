
import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { authorizeRole } from '../middleware/authorizeRole.js'
import { classroomAnalytics } from '../controllers/analytics.controller.js'

const router = Router()

router.use(authenticate)
router.use(authorizeRole('ADMIN', 'TEACHER'))

router.get('/classroom/:classroomId', classroomAnalytics)

export default router
