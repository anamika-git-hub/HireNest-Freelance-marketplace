import { validationResult } from "express-validator";
import { Req, Res, Next } from "../../infrastructure/types/serverPackageTypes";

export const validate = (req: Req, res: Res, next: Next): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors)
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};