
import { Router } from 'express'
import { authenticate } from '../middleware/authenticate.js'
import { authorizeRole } from '../middleware/authorizeRole.js'
import {
  addQuizResult,
  listStudentQuizResults,
    updateStudentQuizResult,
  deleteStudentQuizResult,
} from '../controllers/quiz.controller.js'

const router = Router()

router.use(authenticate)

router.get('/student/:studentId', listStudentQuizResults)

router.use(authorizeRole('ADMIN', 'TEACHER'))

router.post('/', addQuizResult)

router.patch('/:resultId', updateStudentQuizResult)
router.delete('/:resultId', deleteStudentQuizResult)

export default router
