import { Router } from 'express';
import { addTeacher, editTeacher, getTeacherDetails, listTeachers, removeTeacher, } from '../controllers/teacher.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
const router = Router();
router.use(authenticate);
router.use(authorizeRole('ADMIN'));
router.get('/', listTeachers);
router.post('/', addTeacher);
router.get('/:teacherId', getTeacherDetails);
router.patch('/:teacherId', editTeacher);
router.delete('/:teacherId', removeTeacher);
export default router;
//# sourceMappingURL=teacher.routes.js.map