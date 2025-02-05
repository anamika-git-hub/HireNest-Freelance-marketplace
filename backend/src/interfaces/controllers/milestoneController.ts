import { MilestoneUseCase } from "../../application/milestoneUseCase";
import { Req,Res,Next } from "../../infrastructure/types/serverPackageTypes";

export const MilestoneController = {
    createMilestone: async(req:Req, res: Res, next:Next) => {
        const data = req.body
        const result = await MilestoneUseCase.createMilestone(data)
        res.status(200).json({result})
    }
}