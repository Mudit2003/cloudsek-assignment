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
  return jwt.sign(payload, process.env.JWT_SECRET as string);
};


export const generateRefreshToken = async (user: IUser): Promise<string> => {
  const payload: JWTClaims = {
    sub: user.id,
    email: user.email,
    username: user.username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + parseInt("604800", 10), // Expiration time (default to 7 days)
    jti: generateJWTID(),
  };
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string
  );
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 16);
  const logUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: hashedRefreshToken,
    },
  });
  return refreshToken;
};

const generateJWTID = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Decode and verify the access token
export const decodeAccessToken = (token: string): JWTClaims => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JWTClaims;
  } catch (err) {
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
    return null;
  }
};

export const verifyRefreshToken = async (user: IUser, refreshToken: string) => {
  if (!user.refreshToken) {
    throw InvalidRefreshTokenError;
  }
  // Compare the refresh token
  const match = await bcrypt.compare(refreshToken, user.refreshToken);
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
  } catch (error) {
    throw new Error("Failed to revoke refresh token");
  }
};
