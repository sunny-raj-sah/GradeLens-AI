interface CreateStudentInput {
    fullName: string;
    rollNumber: string;
    email?: string;
    classroomId: string;
}
export declare function createStudent(input: CreateStudentInput): Promise<{
    classroomId: string;
    createdAt: Date;
    email: string | null;
    fullName: string;
    id: string;
    rollNumber: string;
}>;
export declare function getStudentsForClassroom(classroomId: string): Promise<{
    classroomId: string;
    createdAt: Date;
    email: string | null;
    fullName: string;
    id: string;
    rollNumber: string;
}[]>;
export {};
//# sourceMappingURL=student.service.d.ts.map