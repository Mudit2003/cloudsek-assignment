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

export const authenticateRequest = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("Here", req.body, req.cookies, req.user);
  const authHeader = (req.headers.authorization ||
    req.headers.Authorization) as String;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Here");
    res
      .status(401)
      .json({ error: "Authorization header is missing or malformed" });
    return;
  }
  console.log(req.header);
  const token = authHeader.split(" ")[1];
  const refreshToken = req.cookies.refreshToken;

  if (!token || !refreshToken) {
    res.status(401).json({ error: "Access token is missing" });
    return;
  }
  let decodedToken;
  try {
    console.log(token);
    decodedToken = decodeAccessToken(token);
    console.log("Access token decoded");
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      try {
        const claims = decodeRefreshToken(refreshToken);

        if (!claims) throw new Error("Invalid Refresh Token");
        const user: IUser = await checkIfUserExists(claims.username);

        console.log("Refresh token verification");
        const newAccessToken = verifyRefreshToken(user, refreshToken);
        res.setHeader("Authorization", `Bearer ${newAccessToken}`);
        // rotating the refresh token
        const newRefreshToken = generateRefreshToken(user);
        res.cookie("refreshToken", newRefreshToken);
        req.user = user;
        next(); // Proceed with the new token
        return;
      } catch (refreshError) {
        res.status(403).json({ error: (refreshError as Error).message }); // Refresh token invalid or expired
        return;
      }
    } else {
      res.status(403); // Token is invalid
      return;
    }
  }

  if (!decodedToken) {
    // in the case of the access token expiring
    res.status(403).json({ error: "Invalid or expired access token" });
    return;
  }

  // Attach user information to the request object
  req.user = {
    id: decodedToken.sub,
    email: decodedToken.email,
    username: decodedToken.username,
    isVerified: true, // you will only be given a refresh token if you are verified hence you know that you are verified
  };
  console.log("decodedToken", decodedToken);

  next();
};
