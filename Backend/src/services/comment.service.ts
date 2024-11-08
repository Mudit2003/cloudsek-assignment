import { PrismaClient } from "@prisma/client";
import { IComment, mapToCommentSchema } from "../interfaces/comment.interface";
import filterUndefined from "../utils/filterUndefined";
import { Optional } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

// this create comment can be create reply too
export const createComment = async (data: IComment) => {
  let parentComment;
  if (data.parentCommentId != null)
    parentComment =
      data.parentComment ??
      (await prisma.comment.findFirst({
        where: { parentCommentId: data.parentCommentId },
      }));

  // nested comment structure not allowed hence handling the same
  if (parentComment && parentComment.parentCommentId != null) {
    // the mentioned section shall be taken care of and preprocessed
    data.content = `@${parentComment.authorId} ` + data.content;
    data.mentions?.push(parentComment.authorId ?? "");
    data.parentCommentId = parentComment.parentCommentId;
  }

  return await prisma.comment.create(mapToCommentSchema(data));
};

export const getCommentsByPostId = async (postId: string) => {
  // the comments you will get will contain both comments and reply
  // you need an extra join to return comments with their joins
  // this only gives comments which are not reply with replies imbued inside
  return await prisma.comment.findMany({
    where: { postId, parentComment: null },
    include: {
      post: true,
      author: true,
      replies: true,
    },
  });
};

export const getCommentById = async (id: string) => {
  prisma.comment.findFirst()
}

export const updateComment = async (
  commentId: string,
  data: Partial<IComment>
) => {
  const filteredData = filterUndefined(data);
  return await prisma.comment.update({
    where: { id: commentId },
    data: filteredData as any, // the issue of id being not null
  });
};

export const deleteComment = async (commentId: string) => {
  // on deleting comment all the related replies should be deleted
  return await prisma.comment.delete({
    where: { id: commentId },
  });
};
