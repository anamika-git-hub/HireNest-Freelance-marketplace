import { Req, Res, Next } from "../../infrastructure/types/serverPackageTypes";

export const catchError = (err: any, req: Req, res: Res, next: Next) => {
    console.error(err.message);
    res.status(500).json({error: err.message || 'Internal Server Error'});
}