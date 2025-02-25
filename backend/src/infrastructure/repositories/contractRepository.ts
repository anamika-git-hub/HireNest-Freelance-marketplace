import { ContractModel } from "../models/ContractModel";
import { IContract } from "../../entities/contract";
import { FilterCriteria } from "../../entities/filter";
import { IMilestonePayment } from "../../entities/milestonePayment";
import { PaymentModel } from "../models/paymentModel";
import mongoose from "mongoose";

export const ContractRepository = {
    createContract: async(data:IContract) =>{
        const contract = new ContractModel(data)
        return await contract.save();
    },
    getContract: async (id: string) => {
        return await ContractModel.findOne({
            $or: [{ bidId: id }, { _id: id }]
        });
    },
    updateContract: async(bidId: string, updates: IContract) => {
        return await ContractModel.findOneAndUpdate({bidId},updates,{upsert:true,new: true})
    },
    updateContractStatus: async (bidId: string, status: string) => {
        const updateFields: any = { status };
    
        if (status === 'accepted') {
            updateFields.startDate = new Date();
        }
    
        return await ContractModel.findOneAndUpdate(
            { bidId },
            { $set: updateFields }, // Use $set to update multiple fields
            {upsert:true, new: true }
        );
    },
    
    getAllContracts: async (filters:FilterCriteria) => {
        return await ContractModel.find({...filters});
    },
    updateMilestoneStatus: async (contractId:string,milestoneId:string, status: string, session: any) => {
        return await ContractModel.findOneAndUpdate({
            _id:contractId,
            'milestones._id':milestoneId
        },
        {
            $set: {'milestones.$.status':status}
        },{new:true}
    )
    },
   

}