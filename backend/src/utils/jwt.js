import jwt from 'jsonwebtoken';
function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }
    return secret;
}
export function signAccessToken(payload) {
    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: '1d',
    });
}
export function verifyAccessToken(token) {
    const decoded = jwt.verify(token, getJwtSecret());
    if (typeof decoded === 'string' ||
        typeof decoded.userId !== 'string' ||
        !['ADMIN', 'TEACHER', 'STUDENT'].includes(decoded.role)) {
        throw new Error('Invalid authentication token');
    }
    return {
        userId: decoded.userId,
        role: decoded.role,
    };
}
//# sourceMappingURL=jwt.js.map