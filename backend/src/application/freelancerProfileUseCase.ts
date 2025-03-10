import { FreelancerProfileRepository } from "../infrastructure/repositories/FreelancerProfileRepository";
import { IFreelancerProfile } from "../entities/freelancerProfile";
import cloudinaryV2 from "../utils/cloudinary";
import { FilterCriteria } from "../entities/filter";

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
        } catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to setup profile: ${error.message}`);
            }else {
                throw new Error(`Failed to setup profile due to an unknown error`);
            }
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
        }catch (error) {
            if(error instanceof Error){
                throw new Error(`Failed to update freelancer profile: ${error.message}`);
            }else {
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
