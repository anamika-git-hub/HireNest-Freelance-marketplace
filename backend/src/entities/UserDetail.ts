import mongoose from "mongoose";

export interface IUserDetail {
    userId: mongoose.Types.ObjectId;
    firstname: string;
    lastname: string;
    phone: string;
    dateOfBirth: Date;
    idType: string;
    idNumber: string;
    profileImage: string | null;
    idFrontImage: string | null;
    idBackImage: string | null;
}