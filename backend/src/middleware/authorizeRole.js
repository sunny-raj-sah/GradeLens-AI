export function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        const authRequest = req;
        if (!authRequest.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
            return;
        }
        if (!allowedRoles.includes(authRequest.user.role)) {
            res.status(403).json({
                success: false,
                message: 'You do not have permission to access this resource',
            });
            return;
        }
        next();
    };
}
//# sourceMappingURL=authorizeRole.js.map