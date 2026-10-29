import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/authenticate.js';
export declare function addQuizResult(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listStudentQuizResults(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateStudentQuizResult(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteStudentQuizResult(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=quiz.controller.d.ts.map