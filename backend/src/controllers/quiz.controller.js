import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { createQuizResult, getQuizResultsForStudent, updateQuizResult, deleteQuizResult, } from '../services/quiz.service.js';
const quizResultSchema = z.object({
    quizName: z.string().trim().min(2).max(150),
    score: z.number().min(0),
    maxScore: z.number().positive(),
    studentId: z.string().trim().min(1),
}).refine((data) => data.score <= data.maxScore, {
    message: 'Score cannot exceed the maximum score',
    path: ['score'],
});
export async function addQuizResult(req, res) {
    const parsed = quizResultSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: 'Invalid quiz result data',
            errors: parsed.error.flatten(),
        });
    }
    const input = parsed.data;
    const student = await prisma.student.findUnique({
        where: { id: input.studentId },
        select: {
            id: true,
            classroom: {
                select: { teacherId: true },
            },
        },
    });
    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }
    if (req.user?.role !== 'ADMIN' &&
        student.classroom.teacherId !== req.user?.userId) {
        return res.status(403).json({
            message: 'You cannot record results for this student',
        });
    }
    const result = await createQuizResult({
        quizName: input.quizName,
        score: input.score,
        maxScore: input.maxScore,
        studentId: input.studentId,
    });
    return res.status(201).json({
        message: 'Quiz result recorded successfully',
        result,
    });
}
export async function listStudentQuizResults(req, res) {
    const studentId = req.params.studentId;
    if (typeof studentId !== 'string' || studentId.trim() === '') {
        return res.status(400).json({ message: 'Invalid student ID' });
    }
    const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: {
            id: true,
            classroom: {
                select: { teacherId: true },
            },
        },
    });
    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }
    if (req.user?.role !== 'ADMIN' &&
        student.classroom.teacherId !== req.user?.userId) {
        return res.status(403).json({
            message: 'You cannot view results for this student',
        });
    }
    const results = await getQuizResultsForStudent(studentId);
    return res.status(200).json({
        count: results.length,
        results,
    });
}
// -----------------------------------------
// new
const updateQuizResultSchema = z
    .object({
    quizName: z.string().trim().min(2).max(150).optional(),
    score: z.number().min(0).optional(),
    maxScore: z.number().positive().optional(),
    takenAt: z.string().datetime().optional(),
})
    .refine((data) => data.quizName !== undefined ||
    data.score !== undefined ||
    data.maxScore !== undefined ||
    data.takenAt !== undefined, {
    message: 'At least one field must be provided for an update',
});
export async function updateStudentQuizResult(req, res) {
    const resultId = req.params.resultId;
    if (typeof resultId !== 'string' || resultId.trim() === '') {
        return res.status(400).json({
            message: 'Invalid quiz result ID',
        });
    }
    const parsed = updateQuizResultSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: 'Invalid quiz result update data',
            errors: parsed.error.flatten(),
        });
    }
    const input = parsed.data;
    const existingResult = await prisma.quizResult.findUnique({
        where: { id: resultId },
        select: {
            id: true,
            score: true,
            maxScore: true,
            student: {
                select: {
                    classroom: {
                        select: {
                            teacherId: true,
                        },
                    },
                },
            },
        },
    });
    if (!existingResult) {
        return res.status(404).json({
            message: 'Quiz result not found',
        });
    }
    if (req.user?.role !== 'ADMIN' &&
        existingResult.student.classroom.teacherId !== req.user?.userId) {
        return res.status(403).json({
            message: 'You cannot update results for this student',
        });
    }
    const effectiveScore = input.score ?? existingResult.score;
    const effectiveMaxScore = input.maxScore ?? existingResult.maxScore;
    if (effectiveScore > effectiveMaxScore) {
        return res.status(400).json({
            message: 'Score cannot exceed the maximum score',
        });
    }
    const result = await updateQuizResult(resultId, {
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
            ? { takenAt: new Date(input.takenAt) }
            : {}),
    });
    return res.status(200).json({
        message: 'Quiz result updated successfully',
        result,
    });
}
export async function deleteStudentQuizResult(req, res) {
    const resultId = req.params.resultId;
    if (typeof resultId !== 'string' || resultId.trim() === '') {
        return res.status(400).json({
            message: 'Invalid quiz result ID',
        });
    }
    const existingResult = await prisma.quizResult.findUnique({
        where: { id: resultId },
        select: {
            id: true,
            student: {
                select: {
                    classroom: {
                        select: {
                            teacherId: true,
                        },
                    },
                },
            },
        },
    });
    if (!existingResult) {
        return res.status(404).json({
            message: 'Quiz result not found',
        });
    }
    if (req.user?.role !== 'ADMIN' &&
        existingResult.student.classroom.teacherId !== req.user?.userId) {
        return res.status(403).json({
            message: 'You cannot delete results for this student',
        });
    }
    await deleteQuizResult(resultId);
    return res.status(200).json({
        message: 'Quiz result deleted successfully',
    });
}
//# sourceMappingURL=quiz.controller.js.map