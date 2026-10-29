export interface JwtPayload {
    userId: string;
    role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}
export declare function signAccessToken(payload: JwtPayload): string;
export declare function verifyAccessToken(token: string): JwtPayload;
//# sourceMappingURL=jwt.d.ts.map