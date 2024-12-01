import mongoose, {Schema} from "mongoose";
import { Icategory } from "../../entities/Category";

const CategorySchema = new Schema<Icategory> (
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            default:''
        },
        
        state: {
            type: String,
            enum:  ["active", "inactive"],
            default: 'active'
        }

    },
    {timestamps: true}
);

export const CategoryModel = mongoose.model<Icategory>('Category', CategorySchema);