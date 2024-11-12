import { NextFunction, Request, Response } from "express";
import {
  AccessTokenMissingError,
  InvalidAccessTokenError,
} from "../errors/auth.error";
import { decodeAccessToken } from "../utils/token.util";
import { IUserRequest } from "../interfaces/user.interface";

export const verifyAuth = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = (req.headers.authorization ||
    req.headers.Authorization) as String;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw AccessTokenMissingError;
  }
  console.log(req.header);
  const token = authHeader.split(" ")[1];

  const payload = decodeAccessToken(token);

  if (!payload) throw InvalidAccessTokenError;
  const { email, username, sub } = payload;

  req.user = {
    id: sub,
    username,
    email,
    isVerified: true,
  };
  console.log(req.user);
  next()
};
