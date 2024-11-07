import mongoose , {Schema, Document, Types} from 'mongoose'
import { IComment } from '../interfaces/IComment';
  
  const commentSchema = new Schema<IComment>({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    // if it is a reply will have a parent comment Id
    // the array having a poor structure is not recommended 
    commentId: {type: Schema.Types.ObjectId, ref: 'Comment'},
    content: { type: String, required: true },
    authorId: { type: String, required: false },
    mentions: [{ type: String }],
    replies: [{type: Schema.Types.ObjectId, ref: 'Comment'}], 
}, { timestamps: true });
  
  export const Comment = mongoose.model<IComment>('Comment', commentSchema);
  