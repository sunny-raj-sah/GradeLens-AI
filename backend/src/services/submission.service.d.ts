interface RecordSubmissionInput {
    homeworkId: string;
    studentId: string;
    score?: number;
    maxScore?: number;
    feedback?: string;
}
export declare function recordSubmission(input: RecordSubmissionInput): Promise<{
    createdAt: Date;
    feedback: string | null;
    homeworkId: string;
    id: string;
    maxScore: number | null;
    score: number | null;
    studentId: string;
    submittedAt: Date | null;
    updatedAt: Date;
}>;
export declare function getSubmissionsForHomework(homeworkId: string): Promise<{
    feedback: string | null;
    id: string;
    maxScore: number | null;
    score: number | null;
    student: {
        fullName: string;
        id: string;
        rollNumber: string;
    };
    submittedAt: Date | null;
}[]>;
export {};
//# sourceMappingURL=submission.service.d.ts.map