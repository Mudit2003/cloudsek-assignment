import { Request, Response } from 'express';
// import { createCommentSchema } from '../validation/postValidation';
import { sanitizeContent } from '../utils/sanitize';
import { IUserRequest } from '../interfaces/IUserRequest';
import { addReplyToComment, createComment } from '../services/CommentService';

export const createCommentController = async (req: IUserRequest, res: Response) => {
//   const parsed = createCommentSchema.safeParse(req);
//   if (!parsed.success) {
//     return res.status(400).json({ error: parsed.error });
//   }
  console.log('Comment Creation service reaced');
  const sanitizedContent = sanitizeContent(req.body.content);
  const comment = await createComment(req.body.postId, sanitizedContent, req.user?.id);
  res.status(201).json(comment);
};

export const addReplyController = async (req: IUserRequest, res: Response) => {
  const sanitizedContent = sanitizeContent(req.body.content);
  if(!req.user){
    res.status(402);
    return 
  }
  const reply = await addReplyToComment(req.params.postId, req.body.commentId, sanitizedContent, req.user?.id);
  res.status(201).json(reply);
};
