import mongoose,{Schema} from "mongoose";
import { IClientProfile } from "../../entities/clientProfile";

const ClientSchema = new Schema<IClientProfile>(
    {
        clientId:{
            type:String,
            required: false,
            unique: true
        },
        fullName:{
            type:String,
            required: true
        },
        phone: {
            type:String,
            required: true
        }
    },
    {timestamps:true}
)

const ClientProfileModel = mongoose.model<IClientProfile>('ClientProfile',ClientSchema);
export default ClientProfileModel;