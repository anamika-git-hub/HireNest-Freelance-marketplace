import {Iuser} from '../entities/User';
import { JwtService } from '../infrastructure/services/JwtService';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { AccountDetailRepository } from '../infrastructure/repositories/accountDetail';
import { hashPassword, comparePassword } from '../infrastructure/services/HashPassword';
import { OtpService } from '../infrastructure/services/OtpService';
import { encrypt ,decrypt} from '../utils/hashHelper';
import { forgotPassword } from '../infrastructure/services/EmailService';
import { NotificationRepository } from '../infrastructure/repositories/notificationRepository';


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
        const refreshToken = JwtService.generateRefreshToken({id:user.id,email:user.email})

        return {message: 'Signup is successfull',token,refreshToken, user}
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
        const userDetails = await AccountDetailRepository.findUserDetailsById(user.id)

    if (!userDetails) throw { statusCode: 404, message: 'User account details not found' };
        const token = JwtService.generateToken({id: user.id, email:user.email});
        const refreshToken = JwtService.generateRefreshToken({id:user.id,email:user.email})
        return {token,refreshToken, user , userDetails};
        
    },

    updateRole: async (role:string, userId: string) => {
        const updatedUser = await UserRepository.updateRole(role,userId);
        
          if (!updatedUser) {
            throw {statusCode:404, message:'User not found'};
          }
          return {updatedUser}
    },
    validatePassword: async (userId:string, currentPassword:string) => {
        
        const user = await UserRepository.findUserById(userId);
        if(!user) throw { statusCode:404, message:'User not found'};
        
         const isValidPassword = await comparePassword(currentPassword,user.password);
         return isValidPassword
        
    },
   
    updatePassword: async (userId:string, newPassword:string) => {
        const password = await hashPassword(newPassword);
        const updatedUser = await UserRepository.updatePassword(userId,password);
        if (!updatedUser) {
            throw {statusCode:404, message:'User not found'};
          }
          return {updatedUser}
    },
    forgotPassword: async (email: string) => {
        let user = await UserRepository.findUserByEmail(email); 
        if (!user) {
            throw new Error("User not found with the provided email");
        }
        const userId: string = user._id.toString(); 
       const token =  await  encrypt(userId);
       
        const resetLink = `http://localhost:3000/reset-password/${token}`
       await forgotPassword(email,resetLink)
       
       console.log('token',token)
    },

    resetPassword: async (password:string, id: string) => {
      
       const userId = await decrypt(id);
       const newPassword = await hashPassword(password);
        const updatedUser = await UserRepository.updatePassword(userId,newPassword);
        if (!updatedUser) {
            throw {statusCode:404, message:'User not found'};
          }
          return {updatedUser}
    },
    getNotification: async(userId:string, type:string) => {
        const result = await NotificationRepository.getNotification(userId,type);
        console.log('rrrrreeeeee',result);
        return result
    }

   
}