import { PrismaClient } from "@prisma/client";
import { gracefulShutdown } from "../utils/gracefulShutdown";

const prisma = new PrismaClient();

export default prisma;
