import { Request, Response } from "express";
import { sanitizeContent } from "../utils/content.util";
import {
  createComment,
  deleteComment,
  getCommentById,
  getCommentsByPostId,
  updateComment,
} from "../services/comment.service";
import { IUserRequest } from "../interfaces/user.interface";
import commentSchema from "../validation/comment.schema";
import { checkIfUserExists } from "../services/user.service";
import { notifyNewComment } from "../utils/socket.util";
import { getPostById } from "../services/post.service";

export const createCommentController = async (
  req: IUserRequest,
  res: Response
) => {
  const parsed = commentSchema.safeParse(req);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  checkIfUserExists(req.body.authorId);

  const sanitizedContent = sanitizeContent(req.body.content);

  const comment = await createComment({
    postId: req.body.postId,
    content: sanitizedContent,
    authorId: req.user?.username ?? "",
  });

  const post = await getPostById(req.body.postId);
  if (post) notifyNewComment(post.authorId, comment);
  res.status(201).json(comment);
};

export const getCommentByPostController = async (
  req: Request,
  res: Response
) => {
  try {
    const comments = await getCommentsByPostId(req.params.id);

    if (!comments) {
      res.status(404).json({ error: "No Comments for this post" });
      return;
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getCommentController = async (req: Request, res: Response) => {
  try {
    const comment = await getCommentById(req.params.id);

    if (!comment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateCommentController = async (req: Request, res: Response) => {
  const parsed = commentSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors });
    return;
  }

  try {
    const updatedComment = await updateComment(req.params.id, req.body);

    if (!updatedComment) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteCommentController = async (req: Request, res: Response) => {
  try {
    const deleted = await deleteComment(req.params.id);

    if (!deleted) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
