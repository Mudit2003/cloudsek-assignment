import IError from "../interfaces/error.interface";

export const CommentNotFoundError: IError = {
  name: "CommentNotFoundError",
  status: 404,
  message: "Comment not found",
};

export const CommentCreationError = (error: Error): IError => ({
  name: "CommentCreationError",
  status: 400,
  message: error.message,
});

export const CommentUpdateError = (error: Error): IError => ({
  name: "CommentUpdateError",
  status: 400,
  message: error.message,
});

export const CommentDeletionError = (error: Error): IError => ({
  name: "CommentDeletionError",
  status: 500,
  message: error.message,
});
