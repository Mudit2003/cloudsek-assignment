import jwt from "jsonwebtoken";
import IUser from "../interfaces/user.interface";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.config";
import JWTClaims from "../interfaces/claim.interface";
import { InvalidRefreshTokenError } from "../errors/auth.error";

export const generateAccessToken = (user: IUser): string => {
  const payload: JWTClaims = {
    sub: user.id,
    email: user.email,
    username: user.username,
    iat: Math.floor(Date.now() / 1000),
    exp:
      Math.floor(Date.now() / 1000) +
      parseInt(process.env.JWT_EXPIRES_IN || "3600", 10), // Expiration time (default to 1 hour)
    jti: generateJWTID(),
  };
  console.log(process.env.JWT_SECRET as string);
  return jwt.sign(payload, process.env.JWT_SECRET as string);
};

// user if first stored in the database then access token update goes on
// for this reason the user shall be IDd before coming here
// hence
export const generateRefreshToken = async (user: IUser): Promise<string> => {
  const payload: JWTClaims = {
    sub: user.id,
    email: user.email,
    username: user.username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + parseInt("604800", 10), // Expiration time (default to 7 days)
    jti: generateJWTID(),
  };
  console.log(payload);
  console.log(process.env.JWT_REFRESH_SECRET as string);
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string
  );
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 16);
  console.log(hashedRefreshToken);
  const logUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: hashedRefreshToken,
    },
  });
  console.log(logUser, hashedRefreshToken, refreshToken);
  return refreshToken;
};

const generateJWTID = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Decode and verify the access token
export const decodeAccessToken = (token: string): JWTClaims => {
  try {
    console.log("token");
    return jwt.verify(token, process.env.JWT_SECRET as string) as JWTClaims;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// Decode and verify the refresh token
export const decodeRefreshToken = (token: string): JWTClaims | null => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as JWTClaims;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// When verifying the refresh token
export const verifyRefreshToken = async (user: IUser, refreshToken: string) => {
  console.log(user);
  if (!user.refreshToken) {
    throw InvalidRefreshTokenError;
  }
  console.log(user);
  // Compare the refresh token with the stored hashed token
  const match = await bcrypt.compare(refreshToken, user.refreshToken);
  console.log('match' , match);
  if (!match) {
    throw InvalidRefreshTokenError;
  }

  // If valid, generate new access and refresh tokens
  const newAccessToken = generateAccessToken(user);

  return { newAccessToken };
};

export const revokeRefreshToken = async (userId: string): Promise<void> => {
  try {
    // Clear the refresh token from the user's record
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    console.log(`Refresh token for user ${userId} has been revoked.`);
  } catch (error) {
    console.error(`Failed to revoke refresh token for user ${userId}:`, error);
    throw new Error("Failed to revoke refresh token");
  }
};
