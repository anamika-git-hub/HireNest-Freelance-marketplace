import { Req, Res, Next } from "../../infrastructure/types/serverPackageTypes";
import { userUseCase } from "../../application/userUseCase";


interface CustomRequest extends Req {
    user?: { userId: string }; 
  }
export const UserController = {
    signUp: async (req: Req, res: Res, next: Next)=> {
        try {
            const result = await userUseCase.signUp(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error)
        }
    },
    googleSignUp: async (req: Req, res: Res, next: Next) => {
        try {
            const {email} = req.body
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
    updateRole: async (req:Req, res: Res, next:Next) => {
        try {
            const {role,userId} = req.body;
            const result = await userUseCase.updateRole(role,userId);
            res.status(200).json(result)
        } catch (error) {
          next(error)   
        }
    },
    validatePassword: async (req: Req, res: Res, next: Next) => {
        try {
            const {id} = req.params;
            const {currentPassword } = req.body;
            
            const result = await userUseCase.validatePassword(id, currentPassword);
    
            if (!result) {
                res.json(result);
            } else {
                res.status(200).json({ message: 'Password is correct.' });
            }
        } catch (error) {
            console.error('Error in password validation:', error);
            next(error);   
        }
    },

    forgotPassword: async (req: Req, res: Res, next: Next) => {
        try {
            const {email} = req.body;
            const result = await userUseCase.forgotPassword(email);
            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    },
    resetPassword: async (req: Req, res: Res, next: Next) => {
        try {
            const {password,id} = req.body;
            const result = await userUseCase.resetPassword(password,id);
            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    },
    getNotification:async (req: CustomRequest, res: Res, next: Next) => {
        try {
            
            const userId = req.user?.userId || '';
            const result = await userUseCase.getNotification(userId)
            res.status(200).json(result)
        } catch (error) {
          next(error)
        }
    },

    notificationRead:async (req: Req, res: Res, next: Next) => {
        try {
            
            const { id } = req.params;
            console.log(id)
            const result = await userUseCase.notificationRead(id)
            res.status(200).json(result)
        } catch (error) {
          next(error)
        }
    },
   
}