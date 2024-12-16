import mongoose, { Schema } from "mongoose";
import { IUserDetail } from "../../entities/UserDetail";

const UserDetailSchema = new Schema<IUserDetail> ({
  id: {type:mongoose.Schema.Types.ObjectId,
       ref:"User",
       default: null
  },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  idType: { type: String, required: true },
  idNumber: { type: String, required: true },
  profileImage: { type: String, required: true },
  idFrontImage: { type: String, required: true },
  idBackImage: { type: String, required: true },
}, { timestamps: true });

export const UserDetailModel = mongoose.model<IUserDetail>('userDetail',UserDetailSchema);