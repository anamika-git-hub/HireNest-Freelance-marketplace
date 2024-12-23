import {Iuser} from '../entities/User';
import { JwtService } from '../infrastructure/services/JwtService';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { hashPassword, comparePassword } from '../infrastructure/services/HashPassword';
import { OtpService } from '../infrastructure/services/OtpService';

export const userUseCase = {
    signUp: async (user:Iuser) =>{
            user.password = await hashPassword(user.password);

            const newUser = (await UserRepository.createUser(user));
    
            await OtpService.generateAndSendOtp(user.email);
            
            return {message: 'Otp send to email for verification', user: newUser};
      
    },

    googleSignUp : async (email: string)=>{
        let user = await UserRepository.findUserByEmail(email);
        if(!user){
            user = await UserRepository.createUser({
                email,
                googleSignUp: true,
                role: 'client'
            });
        }
        const token = JwtService.generateToken({id: user.id, email:user.email});

        return {message: 'Signup is successfull',token, user}
    },

    verifyOtp: async (email: string, otp:string) => {
        await OtpService.verifyOtp(email,otp);
        
        const updatedUser = await UserRepository.updateUserVerification(email, true);
        return {message:'Otp verified successfully', user: updatedUser};
    },

    resendOtp: async (email: string) => {
        const user = await UserRepository.findUserByEmail(email);
        if(!user) throw new Error('User not found');
        
        if(user.isVerified) throw new Error('User is already verified');

        await OtpService.generateAndSendOtp(email);
        return {message: 'Otp resent successfully to the email'};
    },

    login: async (email: string, password: string) =>{
        const user = await UserRepository.findUserByEmail(email);
    
        if(!user) throw { statusCode:404, message:'User not found'};

        const isValidPassword = await comparePassword(password,user.password);
        if(!isValidPassword) throw {statusCode: 401,message:'Invalid credentials'};
        if(!user.isVerified) throw {statusCode: 400, message:'User not verified yet'}
        if(user.isBlocked) throw {statusCode: 403,message:'User is blocked'}
        const token = JwtService.generateToken({id: user.id, email:user.email});
        return {token, user};
        
    },

   
}