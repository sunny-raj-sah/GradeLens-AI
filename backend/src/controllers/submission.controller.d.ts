import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/authenticate.js';
export declare function addSubmission(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listSubmissions(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateSubmission(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function deleteSubmission(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=submission.controller.d.ts.map