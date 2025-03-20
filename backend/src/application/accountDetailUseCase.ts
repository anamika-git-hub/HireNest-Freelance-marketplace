
import { AccountDetailRepository } from "../infrastructure/repositories/accountDetail";
import { IUserDetail } from "../entities/UserDetail";
import { uploadToS3 } from "../utils/uploader";

export const AccountDetailUseCase = {
    setUpProfile: async (data: IUserDetail, files: { [key: string]: Express.Multer.File[] }) => {
        try {
            const uploadImage = async (file: Express.Multer.File, folderName: string) => {
                try {
                    const uniqueFileName = `${Date.now()}-${file.originalname}`;
                    return await uploadToS3(
                        file.buffer,
                        `${folderName}/${uniqueFileName}`
                    );
                } catch (error) {
                    console.error(`Error uploading to S3:`, error);
                    throw new Error(`Failed to upload file to S3`);
                }
            };
    
            const profileImageUrl = files.profileImage ? 
                await uploadImage(files.profileImage[0], 'profileImages') : null;
                
            const idFrontImageUrl = files.idFrontImage ? 
                await uploadImage(files.idFrontImage[0], 'idImages') : null;
                
            const idBackImageUrl = files.idBackImage ? 
                await uploadImage(files.idBackImage[0], 'idImages') : null;
    
                const profileData = {
                    ...data,
                    profileImage: profileImageUrl?.Location ?? null,
                    idFrontImage: idFrontImageUrl?.Location ?? null,
                    idBackImage: idBackImageUrl?.Location ?? null,
                };
    
            return await AccountDetailRepository.createProfile(profileData);
            
        } catch (error) {
            console.error('Profile setup error:', error);
            if (error instanceof Error) {
                throw new Error(`Failed to set up profile: ${error.message}`);
            } else {
                throw new Error(`Failed to set up profile due to an unknown error`);
            }
        }
    },
    updateProfile: async (
        userId: string, 
        updates: IUserDetail, 
        files: { [key: string]: Express.Multer.File[] }
    ) => {
        try {
            const uploadImage = async (file: Express.Multer.File, folderName: string) => {
                try {
                    const uniqueFileName = `${Date.now()}-${file.originalname}`;
                    return await uploadToS3(
                        file.buffer,
                        `${folderName}/${uniqueFileName}`
                    );
                } catch (error) {
                    console.error(`Error uploading to S3:`, error);
                    throw new Error(`Failed to upload file to S3`);
                }
            };
    
            let profileImageUrl = updates.profileImage;
            let idFrontImageUrl = updates.idFrontImage;
            let idBackImageUrl = updates.idBackImage;
    
            if (files.profileImage) {
                const result = await uploadImage(files.profileImage[0], 'profileImages');
                profileImageUrl = result?.Location ?? null;
            }
    
            if (files.idFrontImage) {
                const result = await uploadImage(files.idFrontImage[0], 'idImages');
                idFrontImageUrl = result?.Location ?? null;
            }
    
            if (files.idBackImage) {
                const result = await uploadImage(files.idBackImage[0], 'idImages');
                idBackImageUrl = result?.Location ?? null;
            }
    
            const updatedProfileData: IUserDetail = {
                ...updates,
                profileImage: profileImageUrl,
                idFrontImage: idFrontImageUrl,
                idBackImage: idBackImageUrl
            };
    
            return await AccountDetailRepository.updateProfile(userId, updatedProfileData);
        } catch (error) {
            console.error('Profile update error:', error);
            if (error instanceof Error) {
                throw new Error(`Failed to update profile: ${error.message}`);
            } else {
                throw new Error(`Failed to update profile due to an unknown error`);
            }
        }
    },

    getAccountDetail:async(id:string) => {
        const userDetails = await AccountDetailRepository.findUserDetailsById(id);
    if (!userDetails) throw { statusCode: 404, message: 'User account details not found' };
    return {userDetails}
    }
}