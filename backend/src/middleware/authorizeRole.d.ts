import type { RequestHandler } from 'express';
type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';
export declare function authorizeRole(...allowedRoles: UserRole[]): RequestHandler;
export {};
//# sourceMappingURL=authorizeRole.d.ts.map