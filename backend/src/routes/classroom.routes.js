import { Router } from 'express';
import { addClassroom, listClassrooms, editClassroom, removeClassroom, } from '../controllers/classroom.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
const router = Router();
router.get('/', authenticate, listClassrooms);
router.post('/', authenticate, authorizeRole('ADMIN', 'TEACHER'), addClassroom);
router.patch('/:classroomId', authorizeRole('ADMIN', 'TEACHER'), editClassroom);
router.delete('/:classroomId', authorizeRole('ADMIN', 'TEACHER'), removeClassroom);
export default router;
//# sourceMappingURL=classroom.routes.js.map