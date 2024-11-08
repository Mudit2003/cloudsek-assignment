import prisma from "../config/PrismaClient";
import { IUser } from "../interfaces/user.interface";

export const checkIfUserExists = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    throw new Error(`User ${username} does not exist.`);
  }
};
