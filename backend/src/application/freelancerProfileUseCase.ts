import { FreelancerProfileRepository } from "../infrastructure/repositories/FreelancerProfileRepository";
import { IFreelancerProfile } from "../entities/freelancerProfile";
import { FilterCriteria } from "../entities/filter";
import { uploadToS3 } from "../utils/uploader";

export const FreelancerProfileUseCase = {
createProfile: async (data: IFreelancerProfile, files: { [key: string]: Express.Multer.File[] }) => {
    try {
        const uploadImage = async (file: Express.Multer.File, folderName: string) => {
            try {
                const uniqueFileName = `${Date.now()}-${file.originalname}`;
                const result = await uploadToS3(
                    file.buffer,
                    `${folderName}/${uniqueFileName}`
                );
                return result.Location || `https://${process.env.S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${folderName}/${uniqueFileName}`;
            } catch (error) {
                console.error(`Error uploading to S3:`, error);
                throw new Error(`Failed to upload file to S3`);
            }
        };

        const profileImageUrl = files.profileImage ? 
            await uploadImage(files.profileImage[0], 'freelancerProfiles') : null;
        
        const attachments = await Promise.all(
            (files.attachments || []).map(async (file, index) => {
                const uploadedFile = await uploadImage(file, 'freelancerAttachments');
                
                return {
                    id: data.attachments[index]?.id || `${Date.now()}-${index}`,
                    file: uploadedFile,
                    title: data.attachments[index]?.title || 'Default Title',
                    description: data.attachments[index]?.description || 'Default description'
                };
            })
        );

        const profileData = {
            ...data, 
            profileImage: profileImageUrl,
            attachments,
        };
        
        return await FreelancerProfileRepository.createProfile(profileData);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to setup profile: ${error.message}`);
        } else {
            throw new Error(`Failed to setup profile due to an unknown error`);
        }
    }
},

updateProfile: async (
    id: string,
    updates: Partial<IFreelancerProfile>,
    files: { [key: string]: Express.Multer.File[] }
) => {
    try {
        const uploadImage = async (file: Express.Multer.File, folderName: string) => {
            try {
                const uniqueFileName = `${Date.now()}-${file.originalname}`;
                const result = await uploadToS3(
                    file.buffer,
                    `${folderName}/${uniqueFileName}`
                );
                // Return the S3 URL from the response
                return result.Location || `https://${process.env.S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${folderName}/${uniqueFileName}`;
            } catch (error) {
                console.error(`Error uploading to S3:`, error);
                throw new Error(`Failed to upload file to S3`);
            }
        };

        let profileImageUrl = updates.profileImage;
        const attachments = updates.attachments || [];

        // Upload new profile image if provided
        if (files.profileImage) {
            profileImageUrl = await uploadImage(files.profileImage[0], 'freelancerProfiles');
        }

        // Upload new attachments if provided
        if (files.attachments) {
            const newAttachments = await Promise.all(
                files.attachments.map(async (file, index) => {
                    const uploadedFile = await uploadImage(file, 'freelancerAttachments');
                    return {
                        id: `${Date.now()}-${index}`,
                        file: uploadedFile,
                        title: updates.attachments?.[index]?.title || 'Default Title',
                        description: updates.attachments?.[index]?.description || 'Default description'
                    };
                })
            );
            attachments.push(...newAttachments);
        }

        const updatedProfileData = {
            ...updates,
            profileImage: profileImageUrl,
            attachments,
        };
        
        return await FreelancerProfileRepository.updateProfile(id, updatedProfileData);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to update freelancer profile: ${error.message}`);
        } else {
            throw new Error(`Failed to update freelancer profile due to an unknown error`);
        }
    }
},

    getFreelancers: async({filters,sortCriteria,skip,limit}:{
        filters:FilterCriteria;
        sortCriteria: { [key: string]: 1 | -1 };
        skip: number;
        limit: number;
    })=>{
        try {
            return await FreelancerProfileRepository.getFreelancers(filters,sortCriteria,skip,limit);
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to get freelancer: ${error.message}`);
            }else {
                throw new Error(`Failed to get freelancer due to an unknown error`);
            }
            
        }
    },
    getFreelancersCount: async(filters:FilterCriteria) => {
        return await FreelancerProfileRepository.getFreelancerCount(filters);
    },
     getFreelancerByUserId: async (id: string) => {
            try {
                return await FreelancerProfileRepository.getFreelancerByUserId(id);
            } catch (error) {
                if(error instanceof Error){
                    throw new Error(`Failed to get freelancer by userId: ${error.message}`);
                }else {
                    throw new Error(`Failed to get  freelancer by userId due to an unknown error`);
                }
                
            }
        },
        getFreelancerById: async (id: string) => {
            try {
                return await FreelancerProfileRepository.getFreelancerById(id);
            } catch (error) {
                if(error instanceof Error){
                    throw new Error(`Failed to get freelancer by Id: ${error.message}`);
                }else {
                    throw new Error(`Failed to get freelancer by Id due to an unknown error`);
                }
                
            }
        }
}
