import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { createStudent, getStudentsForClassroom, } from '../services/student.service.js';
const createStudentSchema = z.object({
    fullName: z.string().trim().min(2).max(100),
    rollNumber: z.string().trim().min(1).max(30),
    email: z.string().trim().email().max(254).optional(),
    classroomId: z.string().trim().min(1),
});
export const addStudent = async (req, res, next) => {
    try {
        const authReq = req;
        const input = createStudentSchema.parse(req.body);
        const classroom = await prisma.classroom.findUnique({
            where: { id: input.classroomId },
            select: { id: true, teacherId: true },
        });
        if (!classroom) {
            res.status(404).json({
                success: false,
                message: 'Classroom not found',
            });
            return;
        }
        if (authReq.user.role !== 'ADMIN' &&
            classroom.teacherId !== authReq.user.userId) {
            res.status(403).json({
                success: false,
                message: 'You cannot add students to this classroom',
            });
            return;
        }
        const student = await createStudent({
            fullName: input.fullName,
            rollNumber: input.rollNumber,
            classroomId: input.classroomId,
            ...(input.email !== undefined
                ? { email: input.email }
                : {}),
        });
        res.status(201).json({
            success: true,
            message: 'Student added successfully',
            data: { student },
        });
    }
    catch (error) {
        next(error);
    }
};
export const listStudents = async (req, res, next) => {
    try {
        const authReq = req;
        const classroomId = z.string().trim().min(1).parse(req.params.classroomId);
        const classroom = await prisma.classroom.findUnique({
            where: { id: classroomId },
            select: { id: true, teacherId: true },
        });
        if (!classroom) {
            res.status(404).json({
                success: false,
                message: 'Classroom not found',
            });
            return;
        }
        if (authReq.user.role !== 'ADMIN' &&
            classroom.teacherId !== authReq.user.userId) {
            res.status(403).json({
                success: false,
                message: 'You cannot view students in this classroom',
            });
            return;
        }
        const students = await getStudentsForClassroom(classroomId);
        res.status(200).json({
            success: true,
            data: { students },
        });
    }
    catch (error) {
        next(error);
    }
};
// ------------------------------------------------
// new
const updateStudentSchema = z
    .object({
    fullName: z.string().trim().min(2).max(100).optional(),
    rollNumber: z.string().trim().min(1).max(30).optional(),
    email: z.string().trim().email().max(254).nullable().optional(),
})
    .refine((data) => data.fullName !== undefined ||
    data.rollNumber !== undefined ||
    data.email !== undefined, { message: 'Provide at least one field to update' });
export const getStudentDetails = async (req, res, next) => {
    try {
        const authReq = req;
        const studentId = z.string().trim().min(1).parse(req.params.studentId);
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: {
                id: true,
                fullName: true,
                rollNumber: true,
                email: true,
                classroomId: true,
                createdAt: true,
                updatedAt: true,
                classroom: {
                    select: {
                        id: true,
                        name: true,
                        gradeLevel: true,
                        section: true,
                        academicYear: true,
                        teacherId: true,
                        teacher: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                homeworkSubmissions: {
                    select: {
                        id: true,
                        score: true,
                        maxScore: true,
                        feedback: true,
                        submittedAt: true,
                        homework: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
                quizResults: {
                    select: {
                        id: true,
                        quizName: true,
                        score: true,
                        maxScore: true,
                        takenAt: true,
                    },
                    orderBy: { takenAt: 'desc' },
                },
            },
        });
        if (!student) {
            res.status(404).json({
                success: false,
                message: 'Student not found',
            });
            return;
        }
        if (authReq.user.role !== 'ADMIN' &&
            student.classroom.teacherId !== authReq.user.userId) {
            res.status(403).json({
                success: false,
                message: 'You cannot view this student',
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: { student },
        });
    }
    catch (error) {
        next(error);
    }
};
export const editStudent = async (req, res, next) => {
    try {
        const authReq = req;
        const studentId = z.string().trim().min(1).parse(req.params.studentId);
        const input = updateStudentSchema.parse(req.body);
        const existingStudent = await prisma.student.findUnique({
            where: { id: studentId },
            select: {
                id: true,
                classroom: {
                    select: { teacherId: true },
                },
            },
        });
        if (!existingStudent) {
            res.status(404).json({
                success: false,
                message: 'Student not found',
            });
            return;
        }
        if (authReq.user.role !== 'ADMIN' &&
            existingStudent.classroom.teacherId !== authReq.user.userId) {
            res.status(403).json({
                success: false,
                message: 'You cannot update this student',
            });
            return;
        }
        const student = await prisma.student.update({
            where: { id: studentId },
            data: {
                ...(input.fullName !== undefined
                    ? { fullName: input.fullName }
                    : {}),
                ...(input.rollNumber !== undefined
                    ? { rollNumber: input.rollNumber }
                    : {}),
                ...(input.email !== undefined
                    ? {
                        email: input.email
                            ? input.email.trim().toLowerCase()
                            : null,
                    }
                    : {}),
            },
            select: {
                id: true,
                fullName: true,
                rollNumber: true,
                email: true,
                classroomId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: { student },
        });
    }
    catch (error) {
        next(error);
    }
};
export const removeStudent = async (req, res, next) => {
    try {
        const authReq = req;
        const studentId = z.string().trim().min(1).parse(req.params.studentId);
        const existingStudent = await prisma.student.findUnique({
            where: { id: studentId },
            select: {
                id: true,
                classroom: {
                    select: { teacherId: true },
                },
                _count: {
                    select: {
                        homeworkSubmissions: true,
                        quizResults: true,
                    },
                },
            },
        });
        if (!existingStudent) {
            res.status(404).json({
                success: false,
                message: 'Student not found',
            });
            return;
        }
        if (authReq.user.role !== 'ADMIN' &&
            existingStudent.classroom.teacherId !== authReq.user.userId) {
            res.status(403).json({
                success: false,
                message: 'You cannot delete this student',
            });
            return;
        }
        if (existingStudent._count.homeworkSubmissions > 0 ||
            existingStudent._count.quizResults > 0) {
            res.status(409).json({
                success: false,
                message: 'This student has linked submissions or quiz results. Remove or reassign those records before deleting the student.',
            });
            return;
        }
        await prisma.student.delete({
            where: { id: studentId },
        });
        res.status(200).json({
            success: true,
            message: 'Student deleted successfully',
            data: { studentId },
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=student.controller.js.map