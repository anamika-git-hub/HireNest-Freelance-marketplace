import { Req, Res, Next } from "../../infrastructure/types/serverPackageTypes";
import { userUseCase } from "../../application/userUseCase";

export const UserController = {
    signUp: async (req: Req, res: Res, next: Next)=> {
        try {
            console.log('Request body:', req.body)
            const result = await userUseCase.signUp(req.body);
            res.status(201).json(result);
        } catch (error) {
            next (error);
        }
    },
    login: async (req: Req, res: Res, next: Next)=> {
        try {
            const {email, password}  = req.body;
            const result = await userUseCase.login(email,password);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}