import { MilestoneModel } from "../models/MilestoneModel";
import { IMilestone } from "../../entities/milestone";

export const MilestoneRepository = {
    createMilestone: async(data:IMilestone) =>{
        const milestone = new MilestoneModel(data)
        return await milestone.save()
    },


}