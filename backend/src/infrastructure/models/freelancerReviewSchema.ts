import mongoose,{Schema} from "mongoose";

const freelancerReviewSchema = new Schema(
  {
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userDetail',
      required: true,
    },
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
      unique: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: false,
    },
    projectTitle: {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
);

export const FreelancerReviewModel = mongoose.model('FreelancerReview', freelancerReviewSchema);