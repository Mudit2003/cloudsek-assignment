import { Comment } from '../models/Comment';
import { Types } from 'mongoose';
import { IReply } from '../interfaces/IReplies';
import {Reply} from '../models/Reply'

/**
 * Creates a reply to a comment or another reply.
 * Updates the `replies` array in the `Comment` document with the new reply's ID.
 * @param text - The text of the reply.
 * @param author - The author of the reply.
 * @param parentCommentId - The ID of the parent comment.
 * @param parentReplyId - Optional ID of the parent reply for nested replies.
 * @returns The created reply document.
 */
export async function createReply(
  text: string,
  author: string,
  parentCommentId: Types.ObjectId,
  parentReplyId?: Types.ObjectId
): Promise<IReply> {
  const parentComment = await Comment.findById(parentCommentId);
  if (!parentComment) {
    throw new Error("Parent comment not found");
  }

  // Create the reply
  const reply = new Reply({
    text,
    author,
    parentComment: parentCommentId,
    parentReply: parentReplyId || null, // Optional if it's a reply to a reply
  });

  // Save the reply
  await reply.save();

  // Update the replies array in the parent comment
  await Comment.findByIdAndUpdate(
    parentCommentId,
    { $push: { replies: reply._id } }, // Add the reply ID to the array
    { new: true }
  );

  return reply;
}

/**
 * Deletes a reply and removes it from the `replies` array in the parent comment.
 * @param replyId - The ID of the reply to delete.
 */
export async function deleteReply(replyId: Types.ObjectId): Promise<void> {
  const reply = await Reply.findById(replyId);
  if (!reply) {
    throw new Error("Reply not found");
  }

  // Delete the reply
  await Reply.findByIdAndDelete(replyId);

  // Remove the reply ID from the replies array in the parent comment
  await Comment.findByIdAndUpdate(
    reply.commentId,
    { $pull: { replies: reply._id } } // Remove the reply ID from the array
  );
}

/**
 * Retrieves all replies for a specific comment.
 * @param commentId - The ID of the comment to retrieve replies for.
 * @returns An array of reply documents.
 */
export async function getRepliesForComment(commentId: Types.ObjectId): Promise<IReply[]> {
  return Reply.find({ parentComment: commentId })
    .sort({ createdAt: 1 }) // Sort by creation time
    .exec();
}
