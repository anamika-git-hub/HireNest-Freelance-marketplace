import mongoose from "mongoose";
import { IMilestonePayment } from "../../entities/milestonePayment";
import { PaymentModel } from "../models/paymentModel";

export const Paymentrepository = {
    createEscrowRecord: async (data: IMilestonePayment) => {
        try {
            const escrow = new PaymentModel(data);
            const result = await escrow.save();
            return result;
        } catch (error) {
            throw error;
        }
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
    updateEscrowStatus: async (milestoneId: string, status: string, session: any)=> {
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
    },
    runTransaction: async (operation: (session: any) => Promise<void>) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await operation(session);
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    },
    updateTransactionHistory: async (paymentIntentId:string |null,milestoneId:string | null,status:string,session:any,note:string)=> {
        await PaymentModel.findOneAndUpdate(
            {
              ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
              ...(milestoneId ? { milestoneId } : {})
            },
            {
              $push: {
                transactionHistory: {
                  status,
                  timestamp: new Date(),
                  note
                }
              }
            },
            { session }
          );
    }

}