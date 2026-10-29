import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { askClassroomQuestion } from '../controllers/ai.controller.js';
const router = Router();
router.use(authenticate);
router.use(authorizeRole('ADMIN', 'TEACHER'));
router.post('/ask', askClassroomQuestion);
export default router;
//# sourceMappingURL=ai.routes.js.map