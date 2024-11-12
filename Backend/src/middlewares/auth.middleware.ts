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

export const authenticateRequest = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("Here", req.body, req.cookies, req.user);
  const authHeader = (req.headers.authorization ||
    req.headers.Authorization) as String;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    errorCast(next, AccessTokenMissingError, AccessTokenMissingError);
    return; 
  }

  console.log(req.header);
  const token = authHeader.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    errorCast(next, RefreshTokenMissingError, RefreshTokenMissingError);
  }
  let decodedToken;
  try {
    decodedToken = decodeAccessToken(token);
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      try {
        console.log("Here I am");
        const claims = decodeRefreshToken(refreshToken as string);

        if (!claims) throw InvalidRefreshTokenError;
        const user: IUser = await checkIfUserExists(claims.username);

        const newAccessToken = await verifyRefreshToken(
          user,
          refreshToken as string
        );
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        // rotating the refresh token
        const newRefreshToken = await generateRefreshToken(user);
        res.cookie("refreshToken", newRefreshToken);
        req.user = user;
        console.log("Proceeded further");
        next(); // Proceed with the new token
        return ;
      } catch (refreshError) {
        errorCast(next, refreshError, TokenRefreshError(refreshError as Error));
      }
    } else {
      console.log("Token Expired Error");
      errorCast(next, TokenExpiredError, RefreshTokenMissingError);
    }
  }

  if (!decodedToken) {
    // in the case of the access token expiring
    console.log("Empty Token");
    errorCast(next, InvalidAccessTokenError, InvalidAccessTokenError);
    next();
    return ; 
  }
  console.log(decodedToken);
  // Attach user information to the request object
  req.user = {
    id: decodedToken!.sub,
    email: decodedToken!.email,
    username: decodedToken!.username,
    isVerified: true, // you will only be given a refresh token if you are verified hence you know that you are verified
  };
  console.log("decodedToken", decodedToken);
  next();
};
