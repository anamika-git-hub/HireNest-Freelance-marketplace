import mongoose, {Schema} from "mongoose";

const UserSchema = new Schema ({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['client', 'freelancer', 'admin'],
        default: 'client',
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},{timestamps: true});

export const UserModel = mongoose.model('User', UserSchema);