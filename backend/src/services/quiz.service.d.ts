interface CreateQuizResultInput {
    quizName: string;
    score: number;
    maxScore: number;
    studentId: string;
}
export declare function createQuizResult(input: CreateQuizResultInput): Promise<{
    createdAt: Date;
    id: string;
    maxScore: number;
    quizName: string;
    score: number;
    studentId: string;
    takenAt: Date;
}>;
export declare function getQuizResultsForStudent(studentId: string): Promise<{
    id: string;
    maxScore: number;
    quizName: string;
    score: number;
    studentId: string;
    takenAt: Date;
}[]>;
interface UpdateQuizResultInput {
    quizName?: string;
    score?: number;
    maxScore?: number;
    takenAt?: Date;
}
export declare function updateQuizResult(resultId: string, input: UpdateQuizResultInput): Promise<{
    createdAt: Date;
    id: string;
    maxScore: number;
    quizName: string;
    score: number;
    studentId: string;
    takenAt: Date;
}>;
export declare function deleteQuizResult(resultId: string): Promise<{
    id: string;
    quizName: string;
    studentId: string;
}>;
export {};
//# sourceMappingURL=quiz.service.d.ts.map