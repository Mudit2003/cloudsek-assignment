import prisma from "../config/prisma.config";
import { IPost } from "../interfaces/post.interface";
import {
  deleteCache,
  getCache,
  markStale,
  setCache,
} from "../utils/cache.util";

const cacheAllPostKey = `all_posts-`;
const cachePostKey = `post-`;

// Create a new post
export const createPost = async (data: IPost) => {
  await markStale(cacheAllPostKey + "1");
  const createdPost = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      authorId: data.authorId,
      mentions: data.mentions,
    },
  });
  if (createdPost) await setCache(cachePostKey + createdPost.id, createdPost);
  return createPost;
};

// Retrieve a post by ID
export const getPostById = async (postId: string) : Promise<IPost | null> => {
  const cacheKey = `${cachePostKey}${postId}`;
  const post = await getCache(cacheKey);
  if (post) return post as IPost;

  const postFromDB = await prisma.post.findUnique({
    where: { id: postId },
  });
  if (postFromDB) await setCache(cachePostKey + postId, postFromDB);
  return postFromDB;
};

// Retrieve all posts
export const getAllPosts = async (page: number, limit: number) => {
  const cacheKey = `${cacheAllPostKey}${page}`;

  // Try to get cached data
  const cachedPosts = await getCache(cacheKey);
  if (cachedPosts) {
    console.log("Serving posts from cache for page", page);
    return cachedPosts;
  }

  const offset = (page - 1) * limit;
  return await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit,
  });
};

// Update a post
export const updatePost = async (
  postId: string,
  data: Partial<IPost>,
  page: number
) => {
  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      title: data.title,
      content: data.content,
      authorId: data.authorId,
      mentions: data.mentions,
    },
  });
  if (updatedPost) setCache(cachePostKey + postId, updatePost);
  await markStale(`${cacheAllPostKey}${page}`); // page1 deleted for requerring
  return updatedPost;
};

// Delete a post
export const deletePost = async (postId: string, page: number) => {
  await deleteCache(`${cacheAllPostKey}${page}`);
  return await prisma.post.delete({
    where: { id: postId },
  });
};
