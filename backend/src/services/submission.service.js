import prisma from '../lib/prisma.js';
export async function recordSubmission(input) {
    return prisma.homeworkSubmission.upsert({
        where: {
            homeworkId_studentId: {
                homeworkId: input.homeworkId,
                studentId: input.studentId,
            },
        },
        update: {
            ...(input.score !== undefined ? { score: input.score } : {}),
            ...(input.maxScore !== undefined ? { maxScore: input.maxScore } : {}),
            ...(input.feedback !== undefined ? { feedback: input.feedback } : {}),
            submittedAt: new Date(),
        },
        create: {
            homeworkId: input.homeworkId,
            studentId: input.studentId,
            ...(input.score !== undefined ? { score: input.score } : {}),
            ...(input.maxScore !== undefined ? { maxScore: input.maxScore } : {}),
            ...(input.feedback !== undefined ? { feedback: input.feedback } : {}),
            submittedAt: new Date(),
        },
        select: {
            id: true,
            homeworkId: true,
            studentId: true,
            score: true,
            maxScore: true,
            feedback: true,
            submittedAt: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}
export async function getSubmissionsForHomework(homeworkId) {
    return prisma.homeworkSubmission.findMany({
        where: { homeworkId },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            score: true,
            maxScore: true,
            feedback: true,
            submittedAt: true,
            student: {
                select: {
                    id: true,
                    fullName: true,
                    rollNumber: true,
                },
            },
        },
    });
}
//# sourceMappingURL=submission.service.js.map