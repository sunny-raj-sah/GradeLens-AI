import { Role } from '../generated/prisma/client.js';
interface CreateTeacherInput {
    name: string;
    email: string;
    password: string;
}
interface UpdateTeacherInput {
    name?: string | undefined;
    email?: string | undefined;
}
export declare function getTeachers(): Promise<{
    createdAt: Date;
    email: string;
    id: string;
    name: string;
    role: Role;
    taughtClasses: {
        academicYear: string;
        gradeLevel: string;
        id: string;
        name: string;
        section: string | null;
    }[];
    updatedAt: Date;
}[]>;
export declare function getTeacherById(teacherId: string): Promise<{
    createdAt: Date;
    email: string;
    id: string;
    name: string;
    role: Role;
    taughtClasses: {
        _count: {
            homeworks: number;
            students: number;
        };
        academicYear: string;
        gradeLevel: string;
        id: string;
        name: string;
        section: string | null;
    }[];
    updatedAt: Date;
} | null>;
export declare function createTeacher(input: CreateTeacherInput): Promise<{
    createdAt: Date;
    email: string;
    id: string;
    name: string;
    role: Role;
}>;
export declare function updateTeacher(teacherId: string, input: UpdateTeacherInput): Promise<{
    createdAt: Date;
    email: string;
    id: string;
    name: string;
    role: Role;
    updatedAt: Date;
}>;
export declare function deleteTeacher(teacherId: string): Promise<{
    email: string;
    id: string;
    name: string;
}>;
export {};
//# sourceMappingURL=teacher.service.d.ts.map