import mongoose from "mongoose";

export interface IChat {
    participants: mongoose.Types.ObjectId[]; 
    messages: mongoose.Types.ObjectId[]; 
  }