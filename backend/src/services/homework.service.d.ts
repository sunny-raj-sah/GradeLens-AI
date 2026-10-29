interface CreateHomeworkInput {
    title: string;
    description?: string;
    dueDate?: string;
    classroomId: string;
}
export declare function createHomework(input: CreateHomeworkInput): Promise<{
    classroomId: string;
    createdAt: Date;
    description: string | null;
    dueDate: Date | null;
    id: string;
    title: string;
}>;
export declare function getHomeworkForClassroom(classroomId: string): Promise<{
    _count: {
        submissions: number;
    };
    classroomId: string;
    createdAt: Date;
    description: string | null;
    dueDate: Date | null;
    id: string;
    title: string;
}[]>;
interface UpdateHomeworkInput {
    title?: string;
    description?: string | null;
    dueDate?: Date | null;
}
export declare function updateHomework(homeworkId: string, input: UpdateHomeworkInput): Promise<{
    classroomId: string;
    createdAt: Date;
    description: string | null;
    dueDate: Date | null;
    id: string;
    title: string;
}>;
export declare function deleteHomework(homeworkId: string): Promise<{
    classroomId: string;
    id: string;
    title: string;
}>;
export {};
//# sourceMappingURL=homework.service.d.ts.map