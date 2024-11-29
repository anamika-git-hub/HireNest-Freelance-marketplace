import { OtpModel } from "../models/OtpModel";
import { sendOtpEmail } from "./EmailService";
import { generateOtp } from "../../utils/otpGenerater";

export const OtpService = {
    generateAndSendOtp: async (email: string) => {
        const otp = generateOtp();
        const otpRecord = new OtpModel({
            email,
            otp,
            createdAt: new Date(),
        });
        await otpRecord.save();
        sendOtpEmail(email,otp);
    },
    verifyOtp: async(email: string, otp: string) => {
     console.log('eeee',email, 'ooo', otp)
        const otpRecord = await OtpModel.findOne({email});
       console.log('ooooooooooooo',otpRecord)
        if(!otpRecord) {
            throw new Error ("Invalid OTP")
        }

        const currentTime = Date.now();
        if(currentTime > otpRecord.expiresAt.getTime()){
            throw new Error ("OTP has expired");
        }

        await OtpModel.deleteOne({ email, otp});
        return true;
    }
};