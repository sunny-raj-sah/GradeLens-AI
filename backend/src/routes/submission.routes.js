import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { addSubmission, listSubmissions, updateSubmission, deleteSubmission, } from '../controllers/submission.controller.js';
const router = Router();
router.use(authenticate);
router.use(authorizeRole('ADMIN', 'TEACHER'));
router.post('/', addSubmission);
router.get('/homework/:homeworkId', listSubmissions);
router.patch('/:submissionId', updateSubmission);
router.delete('/:submissionId', deleteSubmission);
export default router;
//# sourceMappingURL=submission.routes.js.map