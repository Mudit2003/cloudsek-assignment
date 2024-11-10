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
import { notifyNewPost } from "../utils/socket.util";

export const createPostController = async (
  req: IUserRequest,
  res: Response
) => {
  console.log(req.body);
  const parsed = postSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.errors });
    return;
  }
  console.log(req.user?.username);
  try {
    const post = await createPost({
      title: req.body.title,
      content: req.body.content,
      authorId: req.user?.username ?? req.body.username,
      mentions: req.body.mentions,
    });
    res.status(201).json(post);
    notifyNewPost();
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllPostsController = async (req: Request, res: Response) => {
  try {
    const posts = await getAllPosts(req.body.page || 1, req.body.limit || 20);

    if (!posts) {
      res.status(404).json({ error: "No more posts are available" });
      return;
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
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

export const updatePostController = async (
  req: IUserRequest,
  res: Response
) => {
  try {
    const { page, ...data } = req.body;
    const updatedPost = await updatePost(req.params.id, data, page);

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
    const deleted = await deletePost(req.params.id, req.body.page);

    if (!deleted) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(204).json("Deletion Successful");
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
