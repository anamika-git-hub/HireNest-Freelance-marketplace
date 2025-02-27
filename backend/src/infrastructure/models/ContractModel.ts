
import mongoose from 'mongoose';

const MilestoneFileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  }
}, { _id: false });

const CompletionDetailsSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  files: [MilestoneFileSchema],
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const PaymentDetailsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  transactionId: {
    type: String,
    required: true
  },
  platformFee: {
    type: String,
    required: true
  },
  netAmount: {
    type: String,
    required: true
  }
}, { _id: false });

const MilestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date
  },
  cost: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['unpaid', 'active', 'review', 'accepted', 'rejected', 'completed'],
    default: 'unpaid'
  },
  completionDetails: CompletionDetailsSchema,
  paymentDetails: PaymentDetailsSchema,
  rejectionReason: String
});

const ContractSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskSubmission',
    required: true
  },
  clientId: {
    type: String,
    ref: 'User',
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'freelancerProfile',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  budget: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  milestones: [MilestoneSchema],
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'accepted'],
    default: 'ongoing'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const ContractModel = mongoose.model('Contract', ContractSchema);