import { JwtService } from "../infrastructure/services/JwtService";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { comparePassword } from "../infrastructure/services/HashPassword";


export const adminUseCase = {
    login: async (email: string, password: string ) => {
        const admin = await UserRepository.findUserByEmail(email);
        if(!admin || admin.role !== 'admin'){
            throw {message:'Admin not found or access denied'};
        }
        const isValidPassword = await comparePassword(password, admin.password);
        if(!isValidPassword){
            throw {message:'Invalid credentials'};
        }

        const token = JwtService.generateToken({id: admin.id, email: admin.email, role: admin.role});
        return {token, admin};
    },
    getAllUsers: async({filters,skip,limit}:{filters:any,skip:number, limit: number}) => {
        return await UserRepository.findUserByRole(filters,skip,limit);
    },
    getUsersCount: async(filters:any) => {
        return await UserRepository.findUserCount(filters)
    },
    toggleBlockUser: async (userId: string, isBlocked: boolean) => {
        const updatedUser = await UserRepository.toggleBlockUser(userId, isBlocked);
       
        return updatedUser;
    },
}