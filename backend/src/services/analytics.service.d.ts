export declare function getClassroomAnalytics(classroomId: string): Promise<{
    classroom: {
        id: string;
        name: string;
        gradeLevel: string;
        section: string | null;
        academicYear: string;
    };
    summary: {
        totalStudents: number;
        totalQuizzes: number;
        totalHomework: number;
        gradedHomeworkCount: number;
        averageQuizPercentage: number | null;
        averageHomeworkPercentage: number | null;
        homeworkCompletionRate: number | null;
        studentsNeedingSupport: number;
        supportThreshold: number;
    };
    studentPerformance: {
        studentId: string;
        name: string;
        rollNumber: string;
        quizCount: number;
        averageQuizPercentage: number | null;
        needsSupport: boolean;
    }[];
} | null>;
//# sourceMappingURL=analytics.service.d.ts.map