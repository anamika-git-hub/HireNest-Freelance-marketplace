import mongoose from 'mongoose';

const TokenBlacklistSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' }, // Automatically delete after 7 days
});

export const TokenBlacklist = mongoose.model('TokenBlacklist', TokenBlacklistSchema);
