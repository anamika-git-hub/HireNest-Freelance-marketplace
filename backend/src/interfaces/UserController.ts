import { Request, Response } from "express";
import { SignUpUseCase } from "../application/user/SignUpUseCase";
import { UserRepository } from "../infrastructure/user/UserRepository";


const userRepository = new UserRepository();
const signUpUseCase = new SignUpUseCase(userRepository);


export const signUpController = async(req: Request, res: Response): Promise<void> => {
    const {email, password, role} = req.body;

    try {
         const token = await signUpUseCase.execute({
            email,
            password,
            role,
            is_blocked: false,
            is_verified: false,
         });
         res.status(201).json({token});
    } catch (error) {
        if(error instanceof Error){
            res.status(400).json({error: error.message}) 
        }else{
            res.status(400).json({error:"An unknow error occured"})
        }
        
    }
};