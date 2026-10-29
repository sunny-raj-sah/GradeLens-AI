import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { recordSubmission, getSubmissionsForHomework, } from '../services/submission.service.js';
const submissionSchema = z.object({
    homeworkId: z.string().trim().min(1),
    studentId: z.string().trim().min(1),
    score: z.number().min(0).optional(),
    maxScore: z.number().positive().optional(),
    feedback: z.string().trim().max(2000).optional(),
}).refine((data) => data.score === undefined ||
    data.maxScore === undefined ||
    data.score <= data.maxScore, {
    message: 'Score cannot exceed the maximum score',
    path: ['score'],
});
export async function addSubmission(req, res) {
    const parsed = submissionSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: 'Invalid submission data',
            errors: parsed.error.flatten(),
        });
    }
    const input = parsed.data;
    const homework = await prisma.homework.findUnique({
        where: { id: input.homeworkId },
        select: {
            id: true,
            classroomId: true,
            classroom: { select: { teacherId: true } },
        },
    });
    if (!homework) {
        return res.status(404).json({ message: 'Homework not found' });
    }
    if (req.user?.role !== 'ADMIN' &&
        homework.classroom.teacherId !== req.user?.userId) {
        return res.status(403).json({
            message: 'You cannot record submissions for this classroom',
        });
    }
    const student = await prisma.student.findFirst({
        where: {
            id: input.studentId,
            classroomId: homework.classroomId,
        },
        select: { id: true },
    });
    if (!student) {
        return res.status(404).json({
            message: 'Student not found in this classroom',
        });
    }
    const submission = await recordSubmission({
        homeworkId: input.homeworkId,
        studentId: input.studentId,
        ...(input.score !== undefined ? { score: input.score } : {}),
        ...(input.maxScore !== undefined ? { maxScore: input.maxScore } : {}),
        ...(input.feedback !== undefined ? { feedback: input.feedback } : {}),
    });
    return res.status(200).json({
        message: 'Homework submission recorded successfully',
        submission,
    });
}
export async function listSubmissions(req, res) {
    const homeworkId = req.params.homeworkId;
    if (typeof homeworkId !== 'string' || homeworkId.trim() === '') {
        return res.status(400).json({
            message: 'Invalid homework ID',
        });
    }
    const homework = await prisma.homework.findUnique({
        where: { id: homeworkId },
        select: {
            id: true,
            classroom: { select: { teacherId: true } },
        },
    });
    if (!homework) {
        return res.status(404).json({ message: 'Homework not found' });
    }
    if (req.user?.role !== 'ADMIN' &&
        homework.classroom.teacherId !== req.user?.userId) {
        return res.status(403).json({
            message: 'You cannot view submissions for this classroom',
        });
    }
    const submissions = await getSubmissionsForHomework(homeworkId);
    return res.status(200).json({
        count: submissions.length,
        submissions,
    });
}
// --------------------------------------------------
const updateSubmissionSchema = z
    .object({
    score: z.number().min(0).optional(),
    maxScore: z.number().positive().optional(),
    feedback: z.string().trim().max(2000).optional(),
})
    .refine((data) => data.score !== undefined ||
    data.maxScore !== undefined ||
    data.feedback !== undefined, {
    message: 'At least one field must be provided for an update',
});
export async function updateSubmission(req, res) {
    const submissionId = req.params.submissionId;
    if (typeof submissionId !== 'string' ||
        submissionId.trim() === '') {
        return res.status(400).json({
            message: 'Invalid submission ID',
        });
    }
    const parsed = updateSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: 'Invalid submission update data',
            errors: parsed.error.flatten(),
        });
    }
    const input = parsed.data;
    const existingSubmission = await prisma.homeworkSubmission.findUnique({
        where: { id: submissionId },
        select: {
            id: true,
            score: true,
            maxScore: true,
            homework: {
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
    if (!existingSubmission) {
        return res.status(404).json({
            message: 'Submission not found',
        });
    }
    if (req.user?.role !== 'ADMIN' &&
        existingSubmission.homework.classroom.teacherId !==
            req.user?.userId) {
        return res.status(403).json({
            message: 'You cannot update submissions for this classroom',
        });
    }
    const effectiveScore = input.score !== undefined
        ? input.score
        : existingSubmission.score;
    const effectiveMaxScore = input.maxScore !== undefined
        ? input.maxScore
        : existingSubmission.maxScore;
    if (effectiveScore !== null &&
        effectiveScore !== undefined &&
        effectiveMaxScore !== null &&
        effectiveMaxScore !== undefined &&
        effectiveScore > effectiveMaxScore) {
        return res.status(400).json({
            message: 'Score cannot exceed the maximum score',
        });
    }
    const submission = await prisma.homeworkSubmission.update({
        where: { id: submissionId },
        data: {
            ...(input.score !== undefined
                ? { score: input.score }
                : {}),
            ...(input.maxScore !== undefined
                ? { maxScore: input.maxScore }
                : {}),
            ...(input.feedback !== undefined
                ? { feedback: input.feedback }
                : {}),
        },
    });
    return res.status(200).json({
        message: 'Submission updated successfully',
        submission,
    });
}
export async function deleteSubmission(req, res) {
    const submissionId = req.params.submissionId;
    if (typeof submissionId !== 'string' ||
        submissionId.trim() === '') {
        return res.status(400).json({
            message: 'Invalid submission ID',
        });
    }
    const existingSubmission = await prisma.homeworkSubmission.findUnique({
        where: { id: submissionId },
        select: {
            id: true,
            homework: {
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
    if (!existingSubmission) {
        return res.status(404).json({
            message: 'Submission not found',
        });
    }
    if (req.user?.role !== 'ADMIN' &&
        existingSubmission.homework.classroom.teacherId !==
            req.user?.userId) {
        return res.status(403).json({
            message: 'You cannot delete submissions for this classroom',
        });
    }
    await prisma.homeworkSubmission.delete({
        where: { id: submissionId },
    });
    return res.status(200).json({
        message: 'Submission deleted successfully',
    });
}
//# sourceMappingURL=submission.controller.js.map