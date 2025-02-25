import mongoose, { Schema } from "mongoose";
import { IMilestonePayment } from "../../entities/milestonePayment";

const PaymentSchema = new Schema<IMilestonePayment>(
  {
    milestoneId: {
        type:String,
        required:true,
    },
    amount: {
        type: Number,
        required: true,
        min:0
    },
    contractId: {
        type: String,
        required: true,
    },
    platformFee: {
        type: Number,
        required: true,
        min:0
    },
    status: {
        type: String,
        required: true,
        enum: ['pending','held','released','failed'],
        default:'pending',
    },
    freelancerId: {
        type: String,
        required: true
    },
    releasedAt: {
        type: Date,
    },
    stripePaymentIntentId: {
        type:String,
        required: true,
        unique: true
    },
    transactionHistory: [{
        status: String,
        timestamp: Date,
        note:String,
    }]
  },{timestamps:true}
);

PaymentSchema.pre('save', function(next) {
    if (this.amount <= 0) {
        next(new Error('Amount must be greater than 0'));
    }
    if (this.platformFee < 0) {
        next(new Error('Platform fee cannot be negative'));
    }
    next();
});

export const PaymentModel = mongoose.model<IMilestonePayment>(
    'payment',PaymentSchema
)