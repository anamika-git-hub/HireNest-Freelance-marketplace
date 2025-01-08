import mongoose, {Schema} from "mongoose";

const BookmarkSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      type: {
        type: String,
        enum: ['task', 'freelancer'], 
        required: true,
      },
    },
  ],
});

export const BookmarkModel = mongoose.model('Bookmark', BookmarkSchema);
