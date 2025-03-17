import mongoose from "mongoose";

export interface IMilestoneSubmissionForm {
    description: string;
    fileUrl?: string | null;
    fileName?: string | undefined;
    submittedAt?: string | Date;
  }

export interface IMilestoneFile {
  fileName: string;
  fileUrl: string;
}

export interface ICompletionDetails {
  description: string;
  files: IMilestoneFile[];
  submittedAt: Date;
}

export interface IPaymentDetails {
  id: string;
  amount: string;
  paymentDate: Date;
  transactionId: string;
  platformFee: string;
  netAmount: string;
}

export interface IMilestone {
  _id: string;
  title: string;
  description: string;
  dueDate?: Date;
  cost: string; 
  status: "unpaid" | "active" | "review" | "accepted" | "rejected" | "completed";
  completionDetails?: ICompletionDetails;
  paymentDetails?: IPaymentDetails;
  rejectionReason?: string;
}

export interface IContract {
  _id?: string;
  taskId: mongoose.Types.ObjectId;
  bidId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId; 
  freelancerId: mongoose.Types.ObjectId; 
  title: string;
  budget: string; 
  description: string;
  milestones: IMilestone[];
  status: "pending" | "ongoing" | "completed" | "accepted"; 
  createdAt?: Date;
  startDate?: Date | null;
}