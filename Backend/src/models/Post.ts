import mongoose, { Document, Schema } from 'mongoose';

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

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true }, // HTML
  authorId: { type: String, required: false },
  media: [{ type: String, url: String }], // Images and videos URLs
  mentions: [{ type: String }],
}, { timestamps: true });

export const Post = mongoose.model<IPost>('Post', postSchema);
