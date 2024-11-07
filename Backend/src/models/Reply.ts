import mongoose , {Schema, Document, Types} from 'mongoose'
import { IReply } from '../interfaces/IReplies';
  
  const replySchema = new Schema<IReply>({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    commentId: {type: Schema.Types.ObjectId, ref: 'Comment'},
    content: { type: String, required: true },
    authorId: { type: String, required: false },
    mentions: [{ type: String }],
}, { timestamps: true });
  
  export const Reply = mongoose.model<IReply>('Comment', replySchema);
  