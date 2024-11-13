import { NextFunction, Request, Response } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getAllPostsByUser,
  getPostById,
  updatePost,
} from "../services/post.service";
import IUser, { IUserRequest } from "../interfaces/user.interface";
import { notifyNewPost } from "../utils/socket.util";
import {
  PostCreationError,
  PostDeletionError,
  PostNotFoundError,
  PostUpdateError,
} from "../errors/post.error";
import { errorCast, errorCastWithParams } from "../utils/error.util";
import { PermissionDeniedError } from "../errors/config.error";
import logger from "../config/logger.config";

export const createPostController = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await createPost({
      title: req.body.title,
      content: req.body.content,
      authorId: req.user?.username!,
      mentions: req.body.mentions,
    });
    res.status(201).json(post);
    notifyNewPost();
  } catch (error) {
    errorCast(next, error, PostCreationError);
  }
};

export const getUsersPost = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.debug("In")
    const posts = await getAllPostsByUser(req.user!.username  ,req.body.page || 1 , req.body.limit || 20);
    if (!posts) {
      throw PostNotFoundError;
    }
    res.status(200).json(posts);
  } catch (error) {
    logger.debug(error)
    errorCast(next, error, PostNotFoundError);
  }
};

export const getAllPostsController = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.debug("In")
    const posts = await getAllPosts(req.body.page || 1 , req.body.limit || 20);
    if (!posts) {
      throw PostNotFoundError;
    }
    res.status(200).json(posts);
  } catch (error) {
    logger.debug(error)
    errorCast(next, error, PostNotFoundError);
  }
};

export const getPostByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await getPostById(req.params.id);
    if (!post) throw PostNotFoundError;
    res.status(200).json(post);
  } catch (error) {
    errorCast(next, error, PostNotFoundError);
  }
};

export const updatePostController = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, ...data } = req.body;
    const post = await getPostById(req.params.id)

    if(!post) throw PostNotFoundError; 
    if(post.authorId !== req.user?.id) throw PermissionDeniedError; 
    
    const updatedPost = await updatePost(req.params.id, data, page);

    if (!updatedPost) {
      throw PostUpdateError;
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    errorCast(next, error, PostNotFoundError);
  }
};

export const deletePostController = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await getPostById(req.params.id)
    if(!post) throw PostNotFoundError; 
    if(post.authorId !== req.user?.id) throw PermissionDeniedError; 

    const deleted = await deletePost(req.params.id, req.body.page);

    if (!deleted) {
      throw PostNotFoundError;
    }

    res.status(204).json("Deletion Successful");
  } catch (error) {
    errorCast(next, error, PostDeletionError);
  }
};
