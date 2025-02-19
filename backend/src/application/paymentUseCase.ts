import { stripe } from "..";
import { ContractRepository } from "../infrastructure/repositories/contractRepository";

export const PaymentUseCase = {
 createPaymentIntent: async (amount: number, milestoneId: string, contractId: string) => {
    const totalAmount = amount * 100;
    const platformFee = totalAmount * 0.10;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: 'usd',
        automatic_payment_methods: {
            enabled: true,
        },
        metadata: {
            milestoneId,
            contractId,
            platformFee,
        }
    });
    return {clientSecret:paymentIntent.client_secret,paymentIntentId:paymentIntent.id}
 },
 createWebhook: async (sig:string,endpointSecret: string,event: any) => {
    if(event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const {milestoneId,contractId, platformFee} = paymentIntent.metadata;

        await ContractRepository.updateMilestoneStatus(contractId,milestoneId,'active');
        await ContractRepository.createEscrowRecord({
            milestoneId,
        contractId,
        amount: paymentIntent.amount,
        platformFee,
        status: 'held'
        });
        
    }
 },

 releaseEscrow: async(contractId: string,milestoneId: string, freelancerId: string) => {
    const escrowRecord = await ContractRepository.getEscrowRecord(milestoneId);
    if(escrowRecord.status !== 'held'){
        throw new Error('Funds not in escrow');
    }

    const transfer = await stripe.transfers.create({
        amount:Math.floor(escrowRecord.amount*0.9),
        currency:'usd',
        destination: freelancerId,
        description:`Payment for milestone ${milestoneId}`,
    });

    await ContractRepository.updateMilestoneStatus(contractId,milestoneId,'completed');
    await ContractRepository.updateEscrowStatus(milestoneId,'released');
    

 }
}