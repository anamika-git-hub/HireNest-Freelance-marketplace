export const generateOtp = (): string => {
    const otp = Math.floor (100000 + Math.random()* 999999).toString();
    return otp;
}