
import { AccountDetailRepository } from "../infrastructure/repositories/accountDetail";
import { IUserDetail } from "../entities/UserDetail";
import cloudinaryV2 from "../utils/cloudinary";

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

    updateProfile: async (id:string, updates:IUserDetail, files: {[key: string]: Express.Multer.File[]}) => {
        try {
            const uploadToCloudinary = async (filePath: string) => {
                const result = await cloudinaryV2.uploader.upload(filePath,{
                    folder: 'Profiles'
                });
                return result.secure_url;
            };

            let profileImageUrl = updates.profileImage;
            let idFrontImageUrl = updates.idFrontImage;
            let idBackImageUrl = updates.idBackImage;

            if (files.profileImage) {
                profileImageUrl = await uploadToCloudinary(files.profileImage[0].path);
            }
            if (files.idFrontImage) {
                idFrontImageUrl = await uploadToCloudinary(files.idFrontImage[0].path);
            }
            if (files.idBackImage) {
                idBackImageUrl = await uploadToCloudinary(files.idBackImage[0].path);
            }

            const updatedProfileData = {
                ...updates,
                profileImage: profileImageUrl,
                idFrontImage: idFrontImageUrl,
                idBackImage: idBackImageUrl,

            }
            return await AccountDetailRepository.updateProfile(id, updatedProfileData);
        } catch (error: any) {
            throw new Error(`Failed to update profile: ${error.message}`)
        }
        
    }
}