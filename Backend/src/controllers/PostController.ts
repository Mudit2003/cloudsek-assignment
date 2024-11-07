import { Request, Response } from 'express';
// import { createPostSchema } from '../validation/postValidation';
import { createPost, getPostWithComments } from '../services/PostService';
import { IUserRequest } from '../interfaces/IUserRequest';

export const createPostController = async (req: IUserRequest, res: Response) : Promise<void> => {
  const { title, content } = req.body;
//   const parsed = createPostSchema.safeParse(req);
//   if (!parsed.success) {
//     return res.status(400).json({ error: parsed.error });
//   }
  const post = await createPost(title, content, req.user?.id);
  res.status(201).json(post);
};

export const getPostController = async (req: Request, res: Response) => {
  const post = await getPostWithComments(req.params.id);
  if (!post)  {
    res.status(404).json({ error: "Post not found" })
    return 
  };
  res.status(200).json(post);
};
