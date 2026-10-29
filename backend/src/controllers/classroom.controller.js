import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { createClassroom, getClassrooms, updateClassroom, deleteClassroom, } from '../services/classroom.service.js';
const createClassroomSchema = z.object({
    name: z.string().trim().min(2).max(100),
    gradeLevel: z.string().trim().min(1).max(30),
    section: z.string().trim().max(20).optional(),
    academicYear: z.string().trim().min(4).max(20),
    teacherId: z.string().optional(),
});
export const listClassrooms = async (req, res, next) => {
    try {
        const authReq = req;
        const user = authReq.user;
        const classrooms = await getClassrooms(user.userId, user.role);
        res.status(200).json({
            success: true,
            data: { classrooms },
        });
    }
    catch (error) {
        next(error);
    }
};
export const addClassroom = async (req, res, next) => {
    try {
        const authReq = req;
        const user = authReq.user;
        const input = createClassroomSchema.parse(req.body);
        // Teachers can create a classroom assigned to themselves.
        // Admins must select an existing teacher.
        const teacherId = user.role === 'TEACHER' ? user.userId : input.teacherId;
        if (!teacherId) {
            res.status(400).json({
                success: false,
                message: 'teacherId is required for administrators',
            });
            return;
        }
        const teacher = await prisma.user.findUnique({
            where: { id: teacherId },
            select: { id: true, role: true },
        });
        if (!teacher || teacher.role !== 'TEACHER') {
            res.status(400).json({
                success: false,
                message: 'The assigned user must be an existing teacher',
            });
            return;
        }
        const classroom = await createClassroom({
            name: input.name,
            gradeLevel: input.gradeLevel,
            ...(input.section !== undefined
                ? { section: input.section }
                : {}),
            academicYear: input.academicYear,
        }, teacherId);
        res.status(201).json({
            success: true,
            message: 'Classroom created successfully',
            data: { classroom },
        });
    }
    catch (error) {
        next(error);
    }
};
// -----------------------------------------------------------------
// new
const updateClassroomSchema = z
    .object({
    name: z.string().trim().min(2).max(100).optional(),
    gradeLevel: z.string().trim().min(1).max(30).optional(),
    section: z.string().trim().max(20).nullable().optional(),
    academicYear: z.string().trim().min(4).max(20).optional(),
})
    .refine((data) => data.name !== undefined ||
    data.gradeLevel !== undefined ||
    data.section !== undefined ||
    data.academicYear !== undefined, {
    message: 'At least one field must be provided for an update',
});
export const editClassroom = async (req, res, next) => {
    try {
        const authReq = req;
        const user = authReq.user;
        const classroomId = z
            .string()
            .trim()
            .min(1)
            .parse(req.params.classroomId);
        const input = updateClassroomSchema.parse(req.body);
        const existingClassroom = await prisma.classroom.findUnique({
            where: { id: classroomId },
            select: {
                id: true,
                teacherId: true,
            },
        });
        if (!existingClassroom) {
            res.status(404).json({
                success: false,
                message: 'Classroom not found',
            });
            return;
        }
        if (user.role !== 'ADMIN' &&
            existingClassroom.teacherId !== user.userId) {
            res.status(403).json({
                success: false,
                message: 'You cannot update this classroom',
            });
            return;
        }
        const classroom = await updateClassroom(classroomId, input);
        res.status(200).json({
            success: true,
            message: 'Classroom updated successfully',
            data: { classroom },
        });
    }
    catch (error) {
        next(error);
    }
};
export const removeClassroom = async (req, res, next) => {
    try {
        const authReq = req;
        const user = authReq.user;
        const classroomId = z
            .string()
            .trim()
            .min(1)
            .parse(req.params.classroomId);
        const existingClassroom = await prisma.classroom.findUnique({
            where: { id: classroomId },
            select: {
                id: true,
                teacherId: true,
                _count: {
                    select: {
                        students: true,
                        homeworks: true,
                    },
                },
            },
        });
        if (!existingClassroom) {
            res.status(404).json({
                success: false,
                message: 'Classroom not found',
            });
            return;
        }
        if (user.role !== 'ADMIN' &&
            existingClassroom.teacherId !== user.userId) {
            res.status(403).json({
                success: false,
                message: 'You cannot delete this classroom',
            });
            return;
        }
        if (existingClassroom._count.students > 0 ||
            existingClassroom._count.homeworks > 0) {
            res.status(409).json({
                success: false,
                message: 'Cannot delete a classroom that contains students or homework. Remove or reassign the related records first.',
            });
            return;
        }
        await deleteClassroom(classroomId);
        res.status(200).json({
            success: true,
            message: 'Classroom deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=classroom.controller.js.map