import {Req, Res, Next} from '../../infrastructure/types/serverPackageTypes';
import { PaymentUseCase } from '../../application/paymentUseCase';
import { Config } from '../../config/config';
import { stripe } from '../..';
import { HttpStatusCode } from '../constants/httpStatusCodes';
import { sendResponse } from "../../utils/responseHandler";
import { PaymentMessages } from '../constants/responseMessages';

export const PaymentController = {
    createPaymentIntent: async (req: Req, res: Res, next: Next) => {
        try {
            const { amount, milestoneId, contractId, freelancerId } = req.body;
            const result = await PaymentUseCase.createPaymentIntent(amount, milestoneId, contractId, freelancerId);
            
            sendResponse(res, HttpStatusCode.OK, {
                message: PaymentMessages.PAYMENT_INTENT_SUCCESS,
                result
            });
        } catch (error) {
            next(error);
        }
    },
    
    createWebhook: async (req: Req, res: Res, next: Next) => {
        try {
            const sig = req.headers['stripe-signature'] as string;
            const endpointSecret = Config.STRIPE_WEBHOOK_SECRET as string;
            const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            await PaymentUseCase.handleWebhook(event);
           
            sendResponse(res, HttpStatusCode.OK, {
                message: PaymentMessages.WEBHOOK_RECEIVED,
                received: true
            });
        } catch (error) {
            next(error);
        }
    },
};