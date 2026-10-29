import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { Role } from '../generated/prisma/client.js';
function createServiceError(message, statusCode) {
    return Object.assign(new Error(message), { statusCode });
}
export async function getTeachers() {
    return prisma.user.findMany({
        where: { role: Role.TEACHER },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            taughtClasses: {
                select: {
                    id: true,
                    name: true,
                    gradeLevel: true,
                    section: true,
                    academicYear: true,
                },
            },
        },
    });
}
export async function getTeacherById(teacherId) {
    return prisma.user.findFirst({
        where: {
            id: teacherId,
            role: Role.TEACHER,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            taughtClasses: {
                select: {
                    id: true,
                    name: true,
                    gradeLevel: true,
                    section: true,
                    academicYear: true,
                    _count: {
                        select: {
                            students: true,
                            homeworks: true,
                        },
                    },
                },
            },
        },
    });
}
export async function createTeacher(input) {
    const email = input.email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
    });
    if (existingUser) {
        throw createServiceError('An account with this email already exists', 409);
    }
    const passwordHash = await bcrypt.hash(input.password, 12);
    return prisma.user.create({
        data: {
            name: input.name.trim(),
            email,
            passwordHash,
            role: Role.TEACHER,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
}
export async function updateTeacher(teacherId, input) {
    const teacher = await prisma.user.findFirst({
        where: {
            id: teacherId,
            role: Role.TEACHER,
        },
        select: { id: true },
    });
    if (!teacher) {
        throw createServiceError('Teacher not found', 404);
    }
    const email = input.email?.trim().toLowerCase();
    if (email) {
        const existingUser = await prisma.user.findFirst({
            where: {
                email,
                NOT: { id: teacherId },
            },
            select: { id: true },
        });
        if (existingUser) {
            throw createServiceError('An account with this email already exists', 409);
        }
    }
    return prisma.user.update({
        where: { id: teacherId },
        data: {
            ...(input.name !== undefined
                ? { name: input.name.trim() }
                : {}),
            ...(email !== undefined ? { email } : {}),
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}
export async function deleteTeacher(teacherId) {
    const teacher = await prisma.user.findFirst({
        where: {
            id: teacherId,
            role: Role.TEACHER,
        },
        select: {
            id: true,
            taughtClasses: {
                select: { id: true },
                take: 1,
            },
        },
    });
    if (!teacher) {
        throw createServiceError('Teacher not found', 404);
    }
    if (teacher.taughtClasses.length > 0) {
        throw createServiceError('This teacher has assigned classrooms. Reassign or remove those classrooms before deleting the teacher.', 409);
    }
    const proctorAssignments = await prisma.studentProctorAssignment.count({
        where: { teacherId },
    });
    if (proctorAssignments > 0) {
        throw createServiceError('This teacher is assigned as a proctor. Reassign or remove their proctor assignments before deleting the teacher.', 409);
    }
    return prisma.user.delete({
        where: { id: teacherId },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
}
//# sourceMappingURL=teacher.service.js.map