// import { ProfileRepository } from "../infrastructure/repositories/ProfileRepository";

// export const ProfileUseCase = {
//     setupFreelancerProfile: async (data: any) => {
//         return await ProfileRepository.createFreelancerProfile(data);
//     },

//     setupClientProfile: async (data: any) => {
//         return await ProfileRepository.createClientProfile(data);

//     },

//     updateFreelancerProfile: async (id: string, updates: any) => {
//         return await ProfileRepository.updateFreelancerProfile(id, updates);
//     },

//     updateClientProfile: async (id: string, updates: any) => {
//         return await ProfileRepository.updateClientProfile (id, updates);
//     },

//     getProfile: async (userId: string, role: 'freelancer' | 'client') => {
//         return await ProfileRepository.findProfileByUserId(userId, role);
//     }
// };

import { ProfileRepository } from "../infrastructure/repositories/ProfileRepository";
import { IUserDetail } from "../entities/UserDetail";
import cloudinaryV2 from "../utils/cloudinary";

export const ProfileUseCase = {
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
            return await ProfileRepository.createProfile(profileData)
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
            return await ProfileRepository.updateProfile(id, updatedProfileData);
        } catch (error: any) {
            throw new Error(`Failed to update profile: ${error.message}`)
        }
        
    }
}