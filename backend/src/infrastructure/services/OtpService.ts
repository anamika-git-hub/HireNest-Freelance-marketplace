import { OtpModel } from "../models/OtpModel";
import { sendOtpEmail } from "./EmailService";
import { generateOtp } from "../../utils/otpGenerater";

export const OtpService = {
    generateAndSendOtp: async (email: string) => {
        await OtpModel.deleteOne({email});
        const otp = generateOtp();
        const otpRecord = new OtpModel({
            email,
            otp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });
        await otpRecord.save();
        sendOtpEmail(email,otp);
    },
    verifyOtp: async (email: string, otp: string) => {
        const otpRecord = await OtpModel.findOne({ email });
        if (!otpRecord) {
            throw new Error("Invalid OTP");
        }
    
        const currentTime = Date.now();
        if (currentTime > otpRecord.expiresAt.getTime()) {
            throw new Error("OTP has expired");
        }
    
        if (otpRecord.otp !== otp) {
            throw new Error("Invalid OTP");
        }
        await OtpModel.deleteOne({ email });
        return true;
    }
    
};