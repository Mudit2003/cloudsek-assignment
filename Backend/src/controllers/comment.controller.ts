import { NextFunction, Request, Response } from "express";
import { sanitizeContent } from "../utils/content.util";
import {
  createComment,
  deleteComment,
  getCommentById,
  getCommentsByPostId,
  updateComment,
} from "../services/comment.service";
import { IUserRequest } from "../interfaces/user.interface";
import { checkIfUserExists } from "../services/user.service";
import { notifyNewComment } from "../utils/socket.util";
import { getPostById } from "../services/post.service";
import {
  CommentCreationError,
  CommentDeletionError,
  CommentNotFoundError,
  CommentUpdateError,
} from "../errors/comment.error";
import { errorCastWithParams } from "../utils/error.util";
import { PermissionDeniedError } from "../errors/config.error";

export const createCommentController = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await checkIfUserExists(req.body.authorId);
    const sanitizedContent = sanitizeContent(req.body.content);
    const comment = await createComment({
      postId: req.body.postId,
      content: sanitizedContent,
      authorId: req.user?.username ?? "",
      parentCommentId: req.body.parentCommentId,
      parentComment: req.body.parentComment,
    });
    const post = await getPostById(req.body.postId);
    res.status(201).json(comment);
  } catch (error) {
    errorCastWithParams(next, error, CommentCreationError);
  }
};

export const getCommentByPostController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comments = (await getCommentsByPostId(req.params.id)) || [];
    res.status(200).json(comments);
  } catch (error) {
    next(CommentNotFoundError);
  }
};

export const getCommentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await getCommentById(req.params.id);
    if (!comment) {
      throw CommentNotFoundError;
    }
    res.status(200).json(comment);
  } catch (error) {
    next(CommentNotFoundError);
  }
};

export const updateCommentController = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {

    const comment = await getCommentById(req.params.id);
    if (
      req.user?.id !== comment.authorId
    ) throw PermissionDeniedError; 
    

    const updatedComment = await updateComment(req.params.id, req.body);

    if (!updatedComment) {
      throw CommentUpdateError;
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    errorCastWithParams(next, error, CommentUpdateError);
  }
};

export const deleteCommentController = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await getCommentById(req.params.id);
    if (
      req.user?.id !== comment.post?.authorId ||
      req.user?.id !== comment.authorId
    ) throw PermissionDeniedError; 

      const deleted = await deleteComment(req.params.id);
    if (!deleted) {
      throw CommentNotFoundError;
    }
    res.status(204).send();
  } catch (error) {
    errorCastWithParams(next, error, CommentDeletionError);
  }
};
