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
  LogoutError,
  RefreshTokenMissingError,
  TokenRefreshError,
} from "../errors/auth.error";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { errorCast } from "../utils/error.util";
import logger from "../config/logger.config";
import { log } from "console";

export const authenticateRequest = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = (req.headers.authorization || req.headers.Authorization) as string;
  const refreshToken = req.cookies.refreshToken;
  
  if (!authHeader?.startsWith("Bearer ")) {
    return errorCast(next, AccessTokenMissingError, AccessTokenMissingError);
  }

  const token = authHeader.split(" ")[1];
  if (!refreshToken) {
    return errorCast(next, RefreshTokenMissingError, RefreshTokenMissingError);
  }

  try {
    // Decode access token
    const decodedToken = decodeAccessToken(token);
    if (!decodedToken) {
      throw InvalidAccessTokenError;
    }
    req.user = {
      id: decodedToken.sub,
      email: decodedToken.email,
      username: decodedToken.username,
      isVerified: true,
    };
    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      
      try {
        const claims = decodeRefreshToken(refreshToken);
        if (!claims) {
          return errorCast(next, InvalidRefreshTokenError, InvalidRefreshTokenError);
        }
        
        const user: IUser = await checkIfUserExists(claims.username);
        const newAccessToken = await verifyRefreshToken(user, refreshToken);

        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        req.user = user;  // Attach user to the request for next middleware/controller
        return next();
      } catch (refreshError) {
        return errorCast(next, refreshError, TokenRefreshError(refreshError as Error));
      }
    } else {
      return errorCast(next, error, InvalidAccessTokenError);
    }
  }
};
