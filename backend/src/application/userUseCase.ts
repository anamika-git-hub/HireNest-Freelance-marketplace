import {Iuser} from '../entities/User';
import { JwtService } from '../infrastructure/services/JwtService';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { hashPassword, comparePassword } from '../infrastructure/services/HashPassword';

export const userUseCase ={
    signUp: async (user:Iuser) =>{
        user.password = await hashPassword(user.password);

        const newUser = await UserRepository.createUser(user);
        const token = JwtService.generateToken({ id: newUser.id, email:newUser.email});
        return {token, user: newUser}
    },
    login: async (email: string, password: string) =>{
        const user = await UserRepository.findUserByEmail(email);
        if(!user) throw new Error('User not found');
        const isValidPassword = await comparePassword(password,user.password);
        if(!isValidPassword) throw new Error ('Invalid credentials');

        const token = JwtService.generateToken({id: user.id, email:user.email});
        return {token, user};
        
    }
}