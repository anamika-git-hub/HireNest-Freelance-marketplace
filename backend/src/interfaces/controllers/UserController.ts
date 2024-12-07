import { Req, Res, Next } from "../../infrastructure/types/serverPackageTypes";
import { userUseCase } from "../../application/userUseCase";

export const UserController = {
    signUp: async (req: Req, res: Res, next: Next)=> {
        try {
            const result = await userUseCase.signUp(req.body);
            res.status(201).json(result);
        } catch (error:any) {
            next(error)
        }
    },
    googleSignUp: async (req: Req, res: Res, next: Next) => {
        try {
            const {email} = req.body
            console.log('eeeee',typeof(email))
            const result = await userUseCase.googleSignUp(email);
            
            res.status(201).json(result)
        } catch (error) {
            next (error)
        }
    },
    verifyOtp: async (req: Req, res: Res, next: Next) => {
        try {
            const {email, otp} = req.body;
            const result = await userUseCase.verifyOtp(email,otp);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },

    resendOtp: async(req: Req, res: Res, next: Next) => {
        try {
            const {email} = req.body;
            const result = await userUseCase.resendOtp(email);
            res.status(200).json(result);
        } catch (error) {
            next(error);
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
    },

   
}