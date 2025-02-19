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
        required: true
    },
    contractId: {
        type: String,
        required: true,
    },
    platformFee: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['held','released'],
        default:'held',
    },
    freelancerId: {
        type: String,
        required: false
    },
    releasedAt: {
        type: Date,
        required: false
    }
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