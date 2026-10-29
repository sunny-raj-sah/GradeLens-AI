import prisma from '../lib/prisma.js';
export async function createHomework(input) {
    return prisma.homework.create({
        data: {
            title: input.title,
            ...(input.description !== undefined
                ? { description: input.description }
                : {}),
            ...(input.dueDate !== undefined
                ? { dueDate: new Date(input.dueDate) }
                : {}),
            classroomId: input.classroomId,
        },
        select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
            classroomId: true,
            createdAt: true,
        },
    });
}
export async function getHomeworkForClassroom(classroomId) {
    return prisma.homework.findMany({
        where: { classroomId },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
            classroomId: true,
            createdAt: true,
            _count: {
                select: { submissions: true },
            },
        },
    });
}
export async function updateHomework(homeworkId, input) {
    return prisma.homework.update({
        where: { id: homeworkId },
        data: {
            ...(input.title !== undefined
                ? { title: input.title }
                : {}),
            ...(input.description !== undefined
                ? { description: input.description }
                : {}),
            ...(input.dueDate !== undefined
                ? { dueDate: input.dueDate }
                : {}),
        },
        select: {
            id: true,
            title: true,
            description: true,
            dueDate: true,
            classroomId: true,
            createdAt: true,
        },
    });
}
export async function deleteHomework(homeworkId) {
    return prisma.homework.delete({
        where: { id: homeworkId },
        select: {
            id: true,
            title: true,
            classroomId: true,
        },
    });
}
//# sourceMappingURL=homework.service.js.map