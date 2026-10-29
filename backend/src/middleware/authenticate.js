import { verifyAccessToken } from '../utils/jwt.js';
export function authenticate(req, res, next) {
    const authRequest = req;
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const token = authorization.slice('Bearer '.length).trim();
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Authentication token is missing',
        });
        return;
    }
    try {
        authRequest.user = verifyAccessToken(token);
        next();
    }
    catch {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired authentication token',
        });
    }
}
//# sourceMappingURL=authenticate.js.map