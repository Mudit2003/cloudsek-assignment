import { Request, Response } from "express";
import { sanitizeContent } from "../utils/sanitize";
import {
  createComment,
  deleteComment,
  getCommentById,
  updateComment,
} from "../services/comment.service";
import { IUserRequest } from "../interfaces/user.interface";
import commentSchema from "../validation/comment.schema";
import { checkIfUserExists } from "../services/user.service";

export const createCommentController = async (
  req: IUserRequest,
  res: Response
) => {
  const parsed = commentSchema.safeParse(req);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error });
  }

  checkIfUserExists(req.body.authorId);

  const sanitizedContent = sanitizeContent(req.body.content);

  const comment = await createComment({
    postId: req.body.postId,
    content: sanitizedContent,
    authorId: req.user?.username ?? "",
  });
  res.status(201).json(comment);
};

export const getCommentController = async (req: Request, res: Response) => {
  try {
    const comment = await getCommentById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
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
    return res.status(400).json({ error: parsed.error.errors });
  }

  try {
    const updatedComment = await updateComment(req.params.id, req.body);

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found" });
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
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
