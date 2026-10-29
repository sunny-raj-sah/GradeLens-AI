import { z } from 'zod';
import { registerUser } from '../services/auth.service.js';
import { loginUser } from '../services/auth.service.js';
export const register = async (req, res, next) => {
    try {
        const input = z.object({
            name: z.string().trim().min(2).max(80),
            email: z.string().trim().email().max(254),
            password: z.string().min(8).max(72),
        }).parse(req.body);
        const user = await registerUser(input);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { user },
        });
    }
    catch (error) {
        next(error);
    }
};
export const login = async (req, res, next) => {
    try {
        const input = z.object({
            email: z.string().trim().email().max(254),
            password: z.string().min(1).max(72),
        }).parse(req.body);
        const result = await loginUser(input.email, input.password);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=auth.controller.js.map