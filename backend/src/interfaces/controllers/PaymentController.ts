import {Req, Res, Next} from '../../infrastructure/types/serverPackageTypes';
import { PaymentUseCase } from '../../application/paymentUseCase';
import { Config } from '../../config/config';
import { stripe } from '../..';

export const PaymentController = {
    createPaymentIntent: async (req: Req, res: Res, next: Next) => {
        try {
            const { amount, milestoneId, contractId,freelancerId} = req.body;
            const result = await PaymentUseCase.createPaymentIntent(amount, milestoneId, contractId, freelancerId);
            res.status(200).json(result)
        } catch (error) {
            next (error)
        }
    },
    createWebhook: async (req: Req, res: Res, next: Next) => {
        try {
            console.log('Received webhook event');
            console.log('Headers:', req.headers);
            console.log('Body:', req.body);
            console.log('Signature:', req.headers['stripe-signature']);
            const sig = req.headers['stripe-signature'] as string;
            const endpointSecret = Config.STRIPE_WEBHOOK_SECRET as string;
            const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
             await PaymentUseCase.handleWebhook(event);
           
            res.status(200).json({received: true})
        } catch (error) {
            next (error)
        }
    },
    releaseEscrow: async (req: Req, res: Res, next: Next) => {
        try {
            const {contractId,milestoneId,freelancerId} = req.body;
            console.log('rrrrrr',req.body)
           const result = await PaymentUseCase.releaseEscrow(contractId,milestoneId,freelancerId);
            res.status(200).json({success:true, result});
        } catch (error) {
            next(error)
        }
    }
}