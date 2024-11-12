import prisma from "../config/prisma.config";
import bcrypt from "bcryptjs";
import { UserNotFoundError } from "../errors/auth.error";
import IUser from "../interfaces/user.interface";
import logger from "../config/logger.config";

export const checkIfUserExists = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    throw UserNotFoundError;
  }
  return user;
};

export const createUser = async (
  username: string,
  password: string,
  email: string
): Promise<any> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
      email: email,
    },
  });
  return user;
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: true,
      comments: true,
    },
  });
  if (!user) {
    throw UserNotFoundError;
  }
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  logger.info("Here")
  if (!user) {
    throw UserNotFoundError;
  }
  return user;
};

export const getUserbyUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: true,
      comments: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      posts: true,
      comments: true,
    },
  });
  return users.map(({ refreshToken, ...user }) => user);
};

export const updateUser = async (
  userId: string,
  data: Partial<{ username: string; email: string; password: string }>
): Promise<any> => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const { refreshToken, ...user } = await prisma.user.update({
    where: { id: userId },
    data: {
      ...data,
    },
  });
  return user;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await prisma.user.delete({
    where: { id: userId },
  });
};

export const verifyUserEmail = async (email: string): Promise<IUser> => {
  const user = await prisma.user.update({
    where: { email },
    data: {
      isVerified: true,
    },
  });
  return user;
};
