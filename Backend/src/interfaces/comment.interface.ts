import { IPost } from "./post.interface";

export interface IComment {
  id?: string;
  postId: string;
  parentCommentId?: string | null;
  parentComment?: IComment;
  content: string;
  authorId: string;
  mentions?: string[];
  replies?: IComment[];
  createdAt?: Date;
  updatedAt?: Date;
  post?: IPost;
}

export const mapToCommentSchema = ({ post , parentComment, ...data }: IComment) => ({
  data: {
    ...data,
    replies: data.replies
      ? {
          create: data.replies.map((reply: IComment) => ({
            postId: reply.postId,
            parentComment: reply.parentCommentId,
            content: reply.content,
            authorId: reply.authorId,
            mentions: reply.mentions,
          })),
        }
      : undefined,
  },
});
