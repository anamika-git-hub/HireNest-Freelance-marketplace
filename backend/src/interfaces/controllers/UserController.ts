import { Req, Res, Next } from "../../infrastructure/types/serverPackageTypes";
import { userUseCase } from "../../application/userUseCase";
import { FilterCriteria } from "../../entities/filter";


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
    getNotification: async (req: CustomRequest, res: Res, next: Next) => {
        try {
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const searchTerm = req.query.searchTerm as string || "";
            const role = req.query.role as string || "";
            const skip = (page - 1) * limit;
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User not found');
            }
    
            const filters: FilterCriteria = {};
            if (searchTerm && searchTerm.trim()) {
                filters.text = { $regex: searchTerm, $options: "i" };
            }
            if (role) filters.role = role;
    
            const result = await userUseCase.getNotification(userId, filters, skip, limit);
            const totalNotifications = await userUseCase.getNotificationCount(userId, filters);
            const totalPages = Math.ceil(totalNotifications / limit);
            res.status(200).json({ result, totalPages });
        } catch (error) {
            next(error);
        }
    },

    notificationRead:async (req: Req, res: Res, next: Next) => {
        try {
            
            const { id } = req.params;
            const result = await userUseCase.notificationRead(id)
            res.status(200).json(result)
        } catch (error) {
          next(error)
        }
    },
   
}