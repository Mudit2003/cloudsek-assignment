export interface IPost {
  id?: string;
  title: string;
  content: string; // HTML with rich text support
  authorId?: string;
  // type could be either of mp4 etc , etc .... Type mimetype
  mentions?: string[]; // Array of user IDs mentioned in the post
  createdAt?: Date;
  updatedAt?: Date;
}
