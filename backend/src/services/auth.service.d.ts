import { Role } from '../generated/prisma/client.js';
interface RegisterInput {
    name: string;
    email: string;
    password: string;
    role?: Role;
}
export declare function registerUser(input: RegisterInput): Promise<{
    createdAt: Date;
    email: string;
    id: string;
    name: string;
    role: Role;
}>;
export declare function loginUser(email: string, password: string): Promise<{
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: Role;
    };
}>;
export {};
//# sourceMappingURL=auth.service.d.ts.map