import { Req, Res, Next } from "../../infrastructure/types/serverPackageTypes";

export const catchError = (err: unknown, req: Req, res: Res, next: Next) => {
    if (err instanceof Error) {
        console.error(err.message);
        const statusCode = (err as { statusCode?: number }).statusCode || 500;
        const message = err.message || 'Internal Server Error';
        res.status(statusCode).json({
            success: false,
            error: message
        });
    } else {
        // If the error is not an instance of Error
        console.error('An unknown error occurred');
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
};
