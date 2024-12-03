import {Iuser} from '../entities/User';
import { JwtService } from '../infrastructure/services/JwtService';
import { TempUserRepository } from '../infrastructure/repositories/tempUserRepository';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { hashPassword, comparePassword } from '../infrastructure/services/HashPassword';
import { OtpService } from '../infrastructure/services/OtpService';

export const userUseCase = {
    signUp: async (user:Iuser) =>{
        try {
            user.password = await hashPassword(user.password);

            const newUser = await UserRepository.createUser(user);
    
            await OtpService.generateAndSendOtp(user.email);
            
            return {message: 'Otp send to email for verification', user: newUser};
        } catch (error:any) {
            console.log('fjfjfj',error)
            throw error;
        }
      
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
        if(!user) throw new Error('User not found');

        const isValidPassword = await comparePassword(password,user.password);
        if(!isValidPassword) throw new Error ('Invalid credentials');
        if(!user.isVerified){
            throw new Error('User not verified yet')
        }
        if(user.isBlocked) throw new Error ('User is blocked') 
        const token = JwtService.generateToken({id: user.id, email:user.email});
        return {token, user};
        
    },

   
}