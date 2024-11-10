import { Request } from "express";
import { IComment } from "./comment.interface";
import { IPost } from "./post.interface";

export default interface IUser {
  id: string;
  username: string;
  posts?: IPost[];
  comments?: IComment[];
  email: string;
  password?: string;
  refreshToken?: string | null;
  isVerified: boolean;
}

export interface IUserRequest extends Request {
  // will be passed from user interface
  headers: { authorization?: string; Authorization?: string };
  cookies: { refreshToken?: string }; // we wont be using tokens from jwt
  user?: IUser;
}
