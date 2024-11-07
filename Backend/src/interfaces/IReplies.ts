// Using a reply schema is not required in such a small scale application but with scalability demonstration in mind I am using a seperate one
import { Document, Types } from "mongoose";

export interface IReply extends Document {
    postId: Types.ObjectId;
    commentId: Types.ObjectId;
    content: string;
    authorId: string;
    mentions: string[];
    createdAt: Date;
    updatedAt: Date;
}