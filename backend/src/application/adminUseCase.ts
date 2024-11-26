import { JwtService } from "../infrastructure/services/JwtService";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { comparePassword } from "../infrastructure/services/HashPassword";

export const adminUseCase = {
    login: async (email: string, password: string ) => {
        const admin = await UserRepository.findUserByEmail(email);
        if(!admin || admin.role !== 'admin'){
            throw new Error('Unauthorized: Admin not found or access denied');
        }
        const isValidPassword = await comparePassword(password, admin.password);
        if(!isValidPassword){
            throw new Error ('Invalid credentials');
        }

        const token = JwtService.generateToken({id: admin.id, email: admin.email, role: admin.role});
        return {token, admin};
    },
    getAllFreelancers: async() => {
        return await UserRepository.findUserByRole('freelancer');
    },
    getAllClients: async () => {
        return await UserRepository.findUserByRole('client');
    }
}