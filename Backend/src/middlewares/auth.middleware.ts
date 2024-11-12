// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import {
  decodeAccessToken,
  decodeRefreshToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.util";
import IUser, { IUserRequest } from "../interfaces/user.interface";
import { checkIfUserExists } from "../services/user.service";
import {
  AccessTokenMissingError,
  InvalidAccessTokenError,
  InvalidRefreshTokenError,
  RefreshTokenMissingError,
  TokenRefreshError,
} from "../errors/auth.error";
import { TokenExpiredError } from "jsonwebtoken";
import { errorCast } from "../utils/error.util";
import logger from "../config/logger.config";

export const authenticateRequest = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = (req.headers.authorization ||
    req.headers.Authorization) as String;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    errorCast(next, AccessTokenMissingError, AccessTokenMissingError);
    logger.info("Required return");
  }

  const token = authHeader.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    errorCast(next, RefreshTokenMissingError, RefreshTokenMissingError);
    return; 
  }
  let decodedToken;
  try {
    decodedToken = decodeAccessToken(token);
  } catch (error) {
    logger.error((error as Error).name)
    if (error instanceof Error && error.name === "TokenExpiredError") {
      try {
        const claims = decodeRefreshToken(refreshToken as string);
        if (!claims)
          errorCast(next, InvalidRefreshTokenError, InvalidRefreshTokenError);
        const user: IUser = await checkIfUserExists(claims!.username);

        const newAccessToken = await verifyRefreshToken(
          user,
          refreshToken as string
        );
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        req.user = user;
        next(); // Proceed with the new token
        return; 
      } catch (refreshError) {
        errorCast(next, refreshError, TokenRefreshError(refreshError as Error));
        return; 
      }
    } else {
      errorCast(next, TokenExpiredError, RefreshTokenMissingError);
      return;
    }
  }

  if (!decodedToken) {
    // in the case of the access token expiring
    errorCast(next, InvalidAccessTokenError, InvalidAccessTokenError);
    return; 
  }
  // Attach user information to the request object
  req.user = {
    id: decodedToken!.sub,
    email: decodedToken!.email,
    username: decodedToken!.username,
    isVerified: true, // you will only be given a refresh token if you are verified hence you know that you are verified
  };
};
