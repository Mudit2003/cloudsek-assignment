export interface IComment {
  id?: string;
  postId: string;
  parentCommentId?: string | null;
  parentComment?: IComment;
  commentId?: string;
  content: string;
  authorId: string;
  mentions?: string[];
  replies?: IComment[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const mapToCommentSchema = ({ parentComment, ...data }: IComment) => ({
  data: {
    ...data,
    replies: data.replies
      ? {
          create: data.replies.map((reply: IComment) => ({
            postId: reply.postId,
            commentId: reply.commentId,
            content: reply.content,
            authorId: reply.authorId,
            mentions: reply.mentions,
          })),
        }
      : undefined,
  },
});
