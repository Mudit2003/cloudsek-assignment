import prisma from "../config/prisma.config";
import bcrypt from "bcryptjs";

export const checkIfUserExists = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    throw new Error(`User ${username} does not exist.`);
  }
  return user;
};

export const createUser = async (
  username: string,
  password: string,
  email: string
): Promise<any> => {
  const hashedPassword = await bcrypt.hash(password, 16);

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
    throw new Error("User not found");
  }
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
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
  return users;
};

export const updateUser = async (
  userId: string,
  data: Partial<{ username: string; email: string; password: string }>
): Promise<any> => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 16);
  }

  const user = await prisma.user.update({
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

export const verifyUserEmail = async (userId: string): Promise<any> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      isVerified: true,
    },
  });
  return user;
};
