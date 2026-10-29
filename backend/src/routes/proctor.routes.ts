
import { Router } from 'express'
import {
  createProctorAssignment,
  getStudentProctor,
  updateProctorAssignment,
  deleteProctorAssignment,
} from '../controllers/proctor.controller.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorizeRole } from '../middleware/authorizeRole.js'

const router = Router()

router.use(authenticate)
router.use(authorizeRole('ADMIN'))

router.post('/assign', createProctorAssignment)
router.get('/student/:studentId', getStudentProctor)
router.patch('/student/:studentId', updateProctorAssignment)
router.delete('/student/:studentId', deleteProctorAssignment)

export default router
