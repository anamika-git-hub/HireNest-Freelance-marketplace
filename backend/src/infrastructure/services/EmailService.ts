import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: 'icor drdl gelp qutd'
    }
});

export const sendOtpEmail =  async (email: string, otp: string) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It will expires in 1 minute.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email} : ${otp}`);
        
    } catch (error) {
        console.log(`Error sending OTP to ${email}:`, error);
        throw new Error('Failed to send OTP')
    }
};

export const forgotPassword = async (email: string, resetLink:string) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset Request',
        text: `Click this link to reset your password: ${resetLink}`
      };
      try {
        await transporter.sendMail(mailOptions);
        
    } catch (error) {
        console.log(`Error sending reset link to ${email}:`, error);
        throw new Error('Failed to send reset link')
    }
}

