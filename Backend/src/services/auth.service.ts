import { createClient } from "redis";

// src/services/auth.service.ts


import bcrypt from "bcryptjs";
import prisma from "../config/prisma.config";
import IUser from "../interfaces/user.interface";
import {
  generateAccessToken,
  generateRefreshToken,
  revokeRefreshToken,
} from "../utils/token.util";
import redis from "../config/redis.config";
import transporter from "../config/mail.config";
import { createUser, getUserByEmail } from "./user.service";

export const register = async (
  username: string,
  email: string,
  password: string
): Promise<IUser> => {
  return await createUser(username, password, email);
};

export const login = async (
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> => {
  const user = await getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  return { accessToken, refreshToken };
};

export const logout = async (userId: string): Promise<void> => {
  revokeRefreshToken(userId);
};

const createOtpKey = (email: String) => `Otp-${email}`;

export const emailVerification = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  console.log("Otp");
  const otp = generateOTP();
  console.log("Store");
  await storeOTP(email, otp);
  console.log("Send");
  await sendEmail(email, "Login to Cloudsek Backend", `Your OTP is ${otp}`);
};

const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // Generates a 4-digit number
};

const sendEmail = async (to: string, subject: string, text: string) => {
  console.log(process.env.SENDINBLUE_USER, process.env.SENDINBLUE_API_KEY);

  await transporter.sendMail({
    from: "raimudit2003@gmail.com",
    to,
    subject,
    text,
  });
};

const storeOTP = async (email: string, otp: string) => {
  console.log("Redis init");
  const otpKey = createOtpKey(email);
  console.log(otpKey, otp);
  await redis.set(otpKey, otp);
  await redis.expire(otpKey, 600);
};

export const validateOTP = async (
  email: string,
  otp: string
): Promise<boolean> => {
  const emailOTP = createOtpKey(email);
  const otpVal = await redis.get(emailOTP);
  console.log(emailOTP, otpVal, otp);

  if (!otpVal || otpVal != otp) {
    return false; // OTP is invalid or expired
  }

  redis.del(emailOTP);
  return true;
};
