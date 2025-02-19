export interface IMilestonePayment {
    milestoneId: string;
    amount: number;
    contractId: string;
    freelancerId ?: string;
    platformFee: number;
    status: string;
    releasedAt?:Date;
}