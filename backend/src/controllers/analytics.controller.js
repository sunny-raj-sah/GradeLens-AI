import prisma from '../lib/prisma.js';
import { getClassroomAnalytics } from '../services/analytics.service.js';
export async function classroomAnalytics(req, res) {
    const classroomId = req.params.classroomId;
    if (typeof classroomId !== 'string' ||
        classroomId.trim() === '') {
        return res.status(400).json({
            message: 'Invalid classroom ID',
        });
    }
    const classroom = await prisma.classroom.findUnique({
        where: { id: classroomId },
        select: {
            id: true,
            teacherId: true,
        },
    });
    if (!classroom) {
        return res.status(404).json({
            message: 'Classroom not found',
        });
    }
    if (req.user?.role !== 'ADMIN' &&
        classroom.teacherId !== req.user?.userId) {
        return res.status(403).json({
            message: 'You cannot access analytics for this classroom',
        });
    }
    const analytics = await getClassroomAnalytics(classroomId);
    if (!analytics) {
        return res.status(404).json({
            message: 'Classroom not found',
        });
    }
    return res.status(200).json(analytics);
}
//# sourceMappingURL=analytics.controller.js.map