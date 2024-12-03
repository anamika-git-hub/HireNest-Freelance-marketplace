import { Req, Res, Next } from "../../infrastructure/types/serverPackageTypes";

export const catchError = (err: any, req: Req, res: Res, next: Next) => {
    console.error(err.message);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    res.status(statusCode).json({ 
        success: false,
        error: message });

}