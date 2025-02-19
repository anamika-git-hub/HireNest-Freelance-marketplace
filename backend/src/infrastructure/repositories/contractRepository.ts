import { ContractModel } from "../models/ContractModel";
import { IContract } from "../../entities/contract";
import { FilterCriteria } from "../../entities/filter";
import { IMilestonePayment } from "../../entities/milestonePayment";
import { PaymentModel } from "../models/escrowModel";

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
    updateMilestoneStatus: async (contractId:string,milestoneId:string, status: string) => {
        return await ContractModel.findOneAndUpdate({
            _id:contractId,
            'milestones._id':milestoneId
        },
        {
            $set: {'milestones.$.status':status}
        },{new:true}
    )
    },
    createEscrowRecord: async (data:IMilestonePayment) =>{
        const escrow = new PaymentModel({
            ...data,
            status:'held'
        })
        return await escrow.save();
    },
    getEscrowRecord: async(milestoneId:string) => {
        const escrowRecord = await PaymentModel.findOne({
            milestoneId,
            status:'held'
        });
        if(!escrowRecord){
            throw new Error('Escrow record not found')
        }
        return escrowRecord;

    },
    updateEscrowStatus: async (milestoneId: string, status: string)=> {
        return await PaymentModel.findOneAndUpdate(
            {milestoneId},
            {
                $set: {
                    status,
                    ...(status === 'released' ? { releasedAt: new Date()}: {})
                }
            },
            {new: true}
        );
    }

}