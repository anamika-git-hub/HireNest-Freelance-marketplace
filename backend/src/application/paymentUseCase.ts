import mongoose from "mongoose";
import { stripe } from "..";
import { ContractRepository } from "../infrastructure/repositories/contractRepository";
import { Paymentrepository } from "../infrastructure/repositories/paymentRepository";
import Stripe from "stripe";

export const PaymentUseCase = {
    createPaymentIntent: async (amount: number, milestoneId: string, contractId: string, freelancerId: string) => {
        if (amount <= 0) throw new Error('Invalid amount');
        
        const totalAmount = Math.round(amount);
        const platformFee = Math.round(totalAmount * 0.10);
        
        try {
            const paymentIntentData: Stripe.PaymentIntentCreateParams = {
                amount: totalAmount,
                currency: 'usd',
                automatic_payment_methods: { enabled: true },
                metadata: {
                    milestoneId,
                    contractId,
                    platformFee: platformFee.toString(),
                    freelancerId
                }
            };
    
            let paymentIntent;
            try {
                paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
            } catch (stripeError:any) {
                throw new Error(`Stripe error: ${stripeError.message}`);
            }
    
            try {
                await Paymentrepository.createEscrowRecord({
                    milestoneId,
                    contractId,
                    amount: totalAmount,
                    platformFee,
                    status: 'pending',
                    freelancerId,
                    stripePaymentIntentId: paymentIntent.id,
                    transactionHistory: [{
                        status: 'pending',
                        timestamp: new Date(),
                        note: 'Payment initiated'
                    }]
                });
            } catch (dbError:any) {
                await stripe.paymentIntents.cancel(paymentIntent.id);
                throw new Error(`Database error: ${dbError.message}`);
            }
    
            return {
                clientSecret: paymentIntent.client_secret?.toString(),
                paymentIntentId: paymentIntent.id
            };
    
        } catch (error:any) {
            throw new Error(error.message || 'Failed to initialize payment');
        }
    },
 handleWebhook: async (event: any) => {
  console.log('lllllllllllllll')
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await PaymentUseCase.handlePaymentSuccess(event.data.object,session);
        break;
      case 'payment_intent.payment_failed':
        await PaymentUseCase.handlePaymentFailure(event.data.object,session);
        break;
      case 'transfer.succeeded':
        await PaymentUseCase.handleTransferSuccess(event.data.object,session);
        break;
      case 'transfer.failed':
        await PaymentUseCase.handleTransferFailure(event.data.object,session);
        break;
    }
    await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
  },

  handlePaymentSuccess: async (paymentIntent: any, session: any) => {
    const { milestoneId, contractId } = paymentIntent.metadata;
    console.log('ddkdkdk')
    await ContractRepository.updateMilestoneStatus(
      contractId,
      milestoneId,
      'active',
      session
    );

    await Paymentrepository.updateEscrowStatus(
      milestoneId,
      'held',
      session
    );

    // Add to transaction history
    await Paymentrepository.updateTransactionHistory(paymentIntent.id,null,'held',session,'Payment successful, funds held in escrow')
    
  },

  handlePaymentFailure: async (paymentIntent: any, session: any) => {
    const { milestoneId } = paymentIntent.metadata;
    
    await Paymentrepository.updateEscrowStatus(
      milestoneId,
      'failed',
      session
    );
    await Paymentrepository.updateTransactionHistory(paymentIntent.id,null,'failed',session,'Payment failed');
  },
  handleTransferSuccess: async (transfer: any, session: any) => {
    const { milestoneId, contractId } = transfer.metadata;
    
    await ContractRepository.updateMilestoneStatus(
      contractId,
      milestoneId,
      'completed',
      session
    );

    await Paymentrepository.updateEscrowStatus(
      milestoneId,
      'released',
      session
    );
    await Paymentrepository.updateTransactionHistory(null,milestoneId,'released',session,'Funds successfully transferred to freelancer');
    
  },

  handleTransferFailure: async (transfer: any, session: any) => {
    const { milestoneId } = transfer.metadata;
    await Paymentrepository.updateTransactionHistory(null,milestoneId,'transfer_failed',session,'Failed to transfer funds to freelancer');

    // You might want to implement retry logic or notify admin
    // TODO: Implement retry mechanism or admin notification
  },

   releaseEscrow: async (contractId: string, milestoneId: string, freelancerId: mongoose.Types.ObjectId) => {
    try {
      const escrowRecord = await Paymentrepository.getEscrowRecord(milestoneId);
      if (!escrowRecord || escrowRecord.status !== 'held') {
        throw new Error('Funds not in escrow');
      }
      
      const transferAmount = Math.floor(escrowRecord.amount * 0.9);
      
      const transactionId = `tx_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
      
      const paymentDetails = {
        id: `pay_${Date.now()}`,
        amount: escrowRecord.amount.toString(),
        paymentDate: new Date().toISOString(),
        transactionId: transactionId,
        platformFee: Math.floor(escrowRecord.amount * 0.1).toString(),
        netAmount: transferAmount.toString()
      };
      
      const updatedMilestone = await ContractRepository.updateMilestoneWithPayment(
        contractId,
        milestoneId,
        'completed',
        paymentDetails
      );
  
      if (!updatedMilestone) {
        throw new Error('Failed to update milestone');
      }
      
      // Then update escrow status
      const updatedEscrow = await Paymentrepository.updateEscrowStatus(
        milestoneId,
        'released'
      );
  
      if (!updatedEscrow) {
        // If escrow update fails, log the error but don't throw
        // since the milestone is already updated
        console.error('Warning: Milestone updated but escrow status update failed');
      }
  
      // Add to transaction history
      await Paymentrepository.updateTransactionHistory(
        null, 
        milestoneId, 
        'released', 
        null, 
        `Payment of ${transferAmount} released to freelancer ID: ${freelancerId}`
      );
      
      console.log('Payment details:', paymentDetails);
      return { success: true, paymentDetails };
    }catch (error) {
      console.error('Error releasing escrow:', error);
      throw error;
    }
  }
}