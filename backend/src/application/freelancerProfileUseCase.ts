import { FreelancerProfileRepository } from "../infrastructure/repositories/FreelancerProfileRepository";
import { IFreelancerProfile } from "../entities/freelancerProfile";
import cloudinaryV2 from "../utils/cloudinary";

export const FreelancerProfileUseCase = {
    createProfile: async (data:IFreelancerProfile, files:{[key: string]: Express.Multer.File[]}) => {
        try {
            const uploadToCloudinary = async (filePath: string) => {
                const result = await cloudinaryV2.uploader.upload(filePath, {
                    folder:'freelancers'
                });
                return result.secure_url;
            }
            const profileImageUrl = files.profileImage? await uploadToCloudinary(files.profileImage[0].path) : null;
            const attachments = await Promise.all(
            (files.attachments || []).map(async (file, index) => {
                const uploadedFile = await uploadToCloudinary(file.path);
                
                return {
                    id: data.attachments[index]?.id ,
                    file: uploadedFile,
                    title: data.attachments[index]?.title || 'Default Title',
                    description: data.attachments[index]?.description || 'Default description'
                }
            })
            );

            const profileData = {
                ...data, 
                profileImage: profileImageUrl,
                attachments,
            };
            return await FreelancerProfileRepository.createProfile(profileData)
        } catch (error: any) {
            throw new Error (`Failed to set up profile: ${error.message}`)
        }
    },

    updateProfile: async (
        id: string,
        updates: Partial<IFreelancerProfile>,
        files: { [key:string]: Express.Multer.File[]}
    )=>{
        try {
            const uploadToCloudinary = async (filePath:string) => {
                const result = await cloudinaryV2.uploader.upload(filePath, {
                    folder: "Freelancers"
                });
                return result.secure_url;
            };
            let profileImageUrl = updates.profileImage;
            const attachments = updates.attachments || []
            if (files.profileImage) {
                profileImageUrl = await uploadToCloudinary(files.profileImage[0].path);
            }

            if(files.attachments) {
                const newAttachments = await Promise.all(
                    files.attachments.map(async(file, index) => {
                        const uploadedFile = await uploadToCloudinary(file.path);
                        return {
                            id:`${Date.now}`,
                            file: uploadedFile,
                            title: updates.attachments?.[index]?.title || 'Default Title',
                            description: updates.attachments?.[index]?.description || 'Default description'
                        }
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
        } catch (error: any) {
            throw new Error (`Failed to update freelancer profile: ${error.message}`);
        }
    },

    getFreelancers: async({sortCriteria,skip,limit}:{
        sortCriteria: { [key: string]: 1 | -1 };
        skip: number;
        limit: number;
})=>{
        try {
            return await FreelancerProfileRepository.getFreelancers(sortCriteria,skip,limit);
        } catch (error:any) {
            throw new Error(`Failed to get freelancers: ${error.message}`);
        }
    },
    getFreelancersCount: async() => {
        return await FreelancerProfileRepository.getFreelancerCount();
    },
     getFreelancerByUserId: async (id: string) => {
            try {
                return await FreelancerProfileRepository.getFreelancerByUserId(id);
            } catch (error: any) {
                throw new Error(`Failed to get freelancer by UserID: ${error.message}`);
            }
        },
        getFreelancerById: async (id: string) => {
            try {
                return await FreelancerProfileRepository.getFreelancerById(id);
            } catch (error: any) {
                throw new Error(`Failed to get freelancer by ID: ${error.message}`);
            }
        }
}
