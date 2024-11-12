import { redisPublisher } from "../config/redis.config";
import { IComment } from "../interfaces/comment.interface";
import { createNotification } from "../services/notification.service";

export const notifyNewComment = async (
  postOwnerId: string,
  commentData: IComment
) => {
  const commentJSON = JSON.stringify(commentData);
  const notifcationBody = JSON.stringify({
    userId: postOwnerId,
    commentJSON,
  });
  await createNotification("newComment", postOwnerId, commentJSON);
  redisPublisher.publish("newComment", notifcationBody);
};

export const notifyNewReply = async (
  commentOwnerId: string,
  replyData: IComment
) => {
  const replyJSON = JSON.stringify(replyData);

  await createNotification("newReply", commentOwnerId, replyJSON);
  redisPublisher.publish(
    "newReply",
    JSON.stringify({
      userId: commentOwnerId,
      replyJSON,
    })
  );
};

export const notifyNewPost = async () => {

  await redisPublisher.publish("newPost",  JSON.stringify({message: "New posts available"}));
};
