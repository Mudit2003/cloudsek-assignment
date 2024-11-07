import { IPost } from '../interfaces/IPost';
import { Post } from '../models/Post';

export const createPost = async (title: string, content: string, authorId: string): Promise<IPost> => {
  const post = new Post({ title, content, authorId });
  return await post.save();
};

export const getPostWithComments = async (postId: string): Promise<IPost | null> => {
  return await Post.findById(postId).populate('comments').exec();
};


export const getPostById = async (postId: string) => {
  return await Post.findById(postId);
};

export const getAllPosts = async () => {
  return await Post.find();
};

export const updatePost = async (postId: string, data: Partial<IPost>) => {
  return await Post.findByIdAndUpdate(postId, data, { new: true });
};

export const deletePost = async (postId: string) => {
  return await Post.findByIdAndDelete(postId);
};
