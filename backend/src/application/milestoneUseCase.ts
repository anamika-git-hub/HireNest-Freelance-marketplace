import { MilestoneRepository } from "../infrastructure/repositories/milestoneRepository";
import { IMilestone } from "../entities/milestone";

export const MilestoneUseCase = {
    createMilestone : async(data:IMilestone)=>{
        return await MilestoneRepository.createMilestone(data)
    }
}