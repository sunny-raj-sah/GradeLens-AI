
import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
// import { authorizeRole } from '../middleware/authorizeRole.js'
// import { askClassroomQuestion } from '../controllers/ai.controller.js'
import { askRoleAwareQuestionController } from '../controllers/ai-assistant.controller.js'

const router = Router()

router.use(authenticate)
// router.use(authorizeRole('ADMIN', 'TEACHER'))

// router.post('/ask', askClassroomQuestion)
router.post('/ask', askRoleAwareQuestionController)

export default router
