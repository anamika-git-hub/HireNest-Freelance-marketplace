import bcrypt from 'bcryptjs';

export const hashedPassword = async (password: string): Promise<string> =>{
    return await bcrypt.hash(password,10)
}