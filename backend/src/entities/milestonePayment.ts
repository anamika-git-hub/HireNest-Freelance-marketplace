interface transactionHistory {
    status: string;
    timestamp: Date;
    note: string;
}

export interface IMilestonePayment {
    milestoneId: string;
    amount: number;
    contractId: string;
    freelancerId : string;
    platformFee: number;
    status: string;
    releasedAt?:Date;
    stripePaymentIntentId: string;
    transactionHistory:transactionHistory[];
}