
import { AccountDetailRepository } from "../infrastructure/repositories/accountDetail";
import { IUserDetail } from "../entities/UserDetail";
import cloudinaryV2 from "../utils/cloudinary";
import { UserRepository } from "../infrastructure/repositories/UserRepository";

export const AccountDetailUseCase = {
    setUpProfile: async (data:IUserDetail, files:{[key: string]: Express.Multer.File[]}) => {
        try {
            const uploadToCloudinary = async (filePath:string) => {
                const result = await cloudinaryV2.uploader.upload(filePath, {
                    folder: 'Profiles',
                });
                return result.secure_url;
            };
            const profileImageUrl = files.profileImage ? await uploadToCloudinary(files.profileImage[0].path) : null;
            const idFrontImageUrl = files.idFrontImage ? await uploadToCloudinary(files.idFrontImage[0].path) : null;
            const idBackImageUrl = files.idBackImage ? await uploadToCloudinary(files.idBackImage[0].path) : null;
            

            const profileData = {
                ...data,
                profileImage: profileImageUrl,
                idFrontImage: idFrontImageUrl,
                idBackImage: idBackImageUrl,
            };
            return await AccountDetailRepository.createProfile(profileData)
            
        } catch (error: any) {
            throw new Error (`Failed to set up profile: ${error.message}`);
        }
    },

    updateProfile: async (userId:string, updates:IUserDetail, files: {[key: string]: Express.Multer.File[]}) => {
        try {
            const uploadToCloudinary = async (filePath: string) => {
                const result = await cloudinaryV2.uploader.upload(filePath,{
                    folder: 'Profiles'
                });
                return result.secure_url;
            };

            let profileImageUrl = updates.profileImage;

            if (files.profileImage) {
                profileImageUrl = await uploadToCloudinary(files.profileImage[0].path);
            }
            const updatedProfileData = {
                ...updates,
                profileImage: profileImageUrl,

            }
            return await AccountDetailRepository.updateProfile(userId, updatedProfileData);
        } catch (error: any) {
            throw new Error(`Failed to update profile: ${error.message}`)
        }
        
    },

    getAccountDetail:async(id:string) => {
        const userDetails = await AccountDetailRepository.findUserDetailsById(id);
    if (!userDetails) throw { statusCode: 404, message: 'User account details not found' };
    return {userDetails}
    }
}