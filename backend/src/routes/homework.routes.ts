
import { Router } from 'express'
import {
  addHomework,
  listHomework,
  editHomework,
  removeHomework,
} from '../controllers/homework.controller.js'
import { authenticate } from '../middleware/authenticate.js'
import { authorizeRole } from '../middleware/authorizeRole.js'

const router = Router()

router.post(
  '/',
  authenticate,
  authorizeRole('ADMIN', 'TEACHER'),
  addHomework,
)

router.get(
  '/classroom/:classroomId',
  authenticate,
  authorizeRole('ADMIN', 'TEACHER'),
  listHomework,
)


router.patch('/:homeworkId',  authenticate,
  authorizeRole('ADMIN', 'TEACHER'), editHomework)
  
router.delete('/:homeworkId',  authenticate,
  authorizeRole('ADMIN', 'TEACHER'), removeHomework)

export default router
