export declare function assignProctor(studentId: string, teacherId: string): Promise<ProctorAssignment | null>;
export interface ProctorAssignment {
    studentId: string;
    studentName: string;
    studentEmail: string | null;
    classroomId: string;
    teacherId: string;
    proctorName: string;
    proctorEmail: string;
    assignedAt: Date;
}
export declare function getProctorAssignment(studentId: string): Promise<ProctorAssignment | null>;
export declare function removeProctorAssignment(studentId: string): Promise<{
    studentId: string;
}>;
//# sourceMappingURL=proctor.service.d.ts.map