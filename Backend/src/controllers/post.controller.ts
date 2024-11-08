import { Request, Response } from "express";
// import { createPostSchema } from '../validation/postValidation';
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../services/post.service";
import { IUserRequest } from "../interfaces/user.interface";
import { postSchema } from "../validation/post.schema";

export const createPostController = async (
  req: IUserRequest,
  res: Response
) => {
  const parsed = postSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors });
  }

  try {
    const post = await createPost({
      title: req.body.title,
      content: req.body.content,
      authorId: req.user?.username,
      mentions: req.body.mentions,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllPostsController = async (req: Request, res: Response) => {
  try {
    const post = await getAllPosts();

    if (!post) {
      res.status(404).json({ error: "No posts available" });
      return;
    }
    res.status(200).json(post);
  } catch (error) {}
};

export const getPostByIdController = async (req: Request, res: Response) => {
  try {
    const post = await getPostById(req.params.id);

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updatePostController = async (req: Request, res: Response) => {
  const parsed = postSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors });
    return;
  }

  try {
    const updatedPost = await updatePost(req.params.id, req.body);

    if (!updatedPost) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deletePostController = async (req: Request, res: Response) => {
  try {
    const deleted = await deletePost(req.params.id);

    if (!deleted) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
