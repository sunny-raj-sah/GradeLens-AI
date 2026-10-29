type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';
interface CreateClassroomInput {
    name: string;
    gradeLevel: string;
    section?: string;
    academicYear: string;
}
export declare function createClassroom(input: CreateClassroomInput, teacherId: string): Promise<{
    academicYear: string;
    createdAt: Date;
    gradeLevel: string;
    id: string;
    name: string;
    section: string | null;
    teacherId: string;
}>;
export declare function getClassrooms(userId: string, role: UserRole): Promise<{
    _count: {
        students: number;
    };
    academicYear: string;
    createdAt: Date;
    gradeLevel: string;
    id: string;
    name: string;
    section: string | null;
    teacherId: string;
}[]>;
interface UpdateClassroomInput {
    name?: string | undefined;
    gradeLevel?: string | undefined;
    section?: string | null | undefined;
    academicYear?: string | undefined;
}
export declare function updateClassroom(classroomId: string, input: UpdateClassroomInput): Promise<{
    academicYear: string;
    createdAt: Date;
    gradeLevel: string;
    id: string;
    name: string;
    section: string | null;
    teacherId: string;
}>;
export declare function deleteClassroom(classroomId: string): Promise<{
    id: string;
    name: string;
    teacherId: string;
}>;
export {};
//# sourceMappingURL=classroom.service.d.ts.map