import { Router } from 'express';
import { addStudent, listStudents, getStudentDetails, editStudent, removeStudent, } from '../controllers/student.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
const router = Router();
router.post('/', authenticate, authorizeRole('ADMIN', 'TEACHER'), addStudent);
router.get('/classroom/:classroomId', authenticate, authorizeRole('ADMIN', 'TEACHER'), listStudents);
router.get('/:studentId', authenticate, authorizeRole('ADMIN', 'TEACHER'), getStudentDetails);
router.patch('/:studentId', authenticate, authorizeRole('ADMIN', 'TEACHER'), editStudent);
router.delete('/:studentId', authenticate, authorizeRole('ADMIN', 'TEACHER'), removeStudent);
export default router;
//# sourceMappingURL=student.routes.js.map