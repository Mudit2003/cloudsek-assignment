import IError from "../interfaces/error.interface";

export const PostNotFoundError: IError = {
  name: "PostNotFoundError",
  status: 404,
  message: "Post not found",
};

export const PostCreationError: IError = {
  name: "PostCreationError",
  status: 400,
  message: "Error creating post",
};

export const PostUpdateError: IError = {
  name: "PostUpdateError",
  status: 400,
  message: "Error updating post",
};

export const PostDeletionError: IError = {
  name: "PostDeletionError",
  status: 500,
  message: "Error deleting post",
};
