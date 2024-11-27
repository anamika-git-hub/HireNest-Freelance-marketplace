export interface IOTP {
    id?: string;
    email: string;
    otp: string;
    createdAt: Date;
    expiresAt: Date;
    isVerified: boolean;
}