import prisma from "../config/PrismaClient";
import { IPost } from "../interfaces/post.interface";

// Create a new post
export const createPost = async (data: IPost) => {
  return await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      authorId: data.authorId ?? "",
      mentions: data.mentions,
    },
  });
};

// Retrieve a post by ID
export const getPostById = async (postId: string) => {
  return await prisma.post.findUnique({
    where: { id: postId },
  });
};

// Retrieve all posts
export const getAllPosts = async () => {
  return await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
};

// Update a post
export const updatePost = async (postId: string, data: Partial<IPost>) => {
  return await prisma.post.update({
    where: { id: postId },
    data: {
      title: data.title,
      content: data.content,
      authorId: data.authorId,
      mentions: data.mentions,
    },
  });
};

// Delete a post
export const deletePost = async (postId: string) => {
  return await prisma.post.delete({
    where: { id: postId },
  });
};
