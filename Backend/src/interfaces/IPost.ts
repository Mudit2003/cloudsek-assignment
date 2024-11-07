import { Document } from "mongoose";

export interface IPost extends Document {
    title: string;
    content: string; // HTML with rich text support
    authorId: string;
    // type could be either of mp4 etc , etc .... Type mimetype 
    media: { type: string, url: string }[];
    mentions: string[]; // Array of user IDs mentioned in the post
    createdAt: Date;
    updatedAt: Date;
}
  