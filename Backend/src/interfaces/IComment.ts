import { Document, Types } from "mongoose";

export interface IComment extends Document {
    postId: Types.ObjectId;
    commentId: Types.ObjectId;
    content: string;
    authorId: string;
    mentions: string[];
    replies: IComment[];
    createdAt: Date;
    updatedAt: Date;
}