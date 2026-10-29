import prisma from '../lib/prisma.js';
export async function createClassroom(input, teacherId) {
    return prisma.classroom.create({
        data: {
            name: input.name,
            gradeLevel: input.gradeLevel,
            ...(input.section !== undefined
                ? { section: input.section }
                : {}),
            academicYear: input.academicYear,
            teacherId,
        },
        select: {
            id: true,
            name: true,
            gradeLevel: true,
            section: true,
            academicYear: true,
            teacherId: true,
            createdAt: true,
        },
    });
}
export async function getClassrooms(userId, role) {
    const where = role === 'ADMIN'
        ? {}
        : role === 'TEACHER'
            ? { teacherId: userId }
            : { students: { some: { userId } } };
    return prisma.classroom.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            gradeLevel: true,
            section: true,
            academicYear: true,
            teacherId: true,
            createdAt: true,
            _count: {
                select: { students: true },
            },
        },
    });
}
export async function updateClassroom(classroomId, input) {
    return prisma.classroom.update({
        where: { id: classroomId },
        data: {
            ...(input.name !== undefined
                ? { name: input.name }
                : {}),
            ...(input.gradeLevel !== undefined
                ? { gradeLevel: input.gradeLevel }
                : {}),
            ...(input.section !== undefined
                ? { section: input.section }
                : {}),
            ...(input.academicYear !== undefined
                ? { academicYear: input.academicYear }
                : {}),
        },
        select: {
            id: true,
            name: true,
            gradeLevel: true,
            section: true,
            academicYear: true,
            teacherId: true,
            createdAt: true,
        },
    });
}
export async function deleteClassroom(classroomId) {
    return prisma.classroom.delete({
        where: { id: classroomId },
        select: {
            id: true,
            name: true,
            teacherId: true,
        },
    });
}
//# sourceMappingURL=classroom.service.js.map