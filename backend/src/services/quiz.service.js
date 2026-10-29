import prisma from '../lib/prisma.js';
export async function createQuizResult(input) {
    return prisma.quizResult.create({
        data: {
            quizName: input.quizName,
            score: input.score,
            maxScore: input.maxScore,
            studentId: input.studentId,
        },
        select: {
            id: true,
            quizName: true,
            score: true,
            maxScore: true,
            takenAt: true,
            studentId: true,
            createdAt: true,
        },
    });
}
export async function getQuizResultsForStudent(studentId) {
    return prisma.quizResult.findMany({
        where: { studentId },
        orderBy: { takenAt: 'desc' },
        select: {
            id: true,
            quizName: true,
            score: true,
            maxScore: true,
            takenAt: true,
            studentId: true,
        },
    });
}
export async function updateQuizResult(resultId, input) {
    return prisma.quizResult.update({
        where: { id: resultId },
        data: {
            ...(input.quizName !== undefined
                ? { quizName: input.quizName }
                : {}),
            ...(input.score !== undefined
                ? { score: input.score }
                : {}),
            ...(input.maxScore !== undefined
                ? { maxScore: input.maxScore }
                : {}),
            ...(input.takenAt !== undefined
                ? { takenAt: input.takenAt }
                : {}),
        },
        select: {
            id: true,
            quizName: true,
            score: true,
            maxScore: true,
            takenAt: true,
            studentId: true,
            createdAt: true,
        },
    });
}
export async function deleteQuizResult(resultId) {
    return prisma.quizResult.delete({
        where: { id: resultId },
        select: {
            id: true,
            quizName: true,
            studentId: true,
        },
    });
}
//# sourceMappingURL=quiz.service.js.map