import prisma from "../config/prisma.config";
import { Request, Response } from "express";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      },
    });
    console.log(user);
    if (!user) {
      res.status(404).json("Error creating a User");
      return;
    }
    res.status(201).json(user);
  } catch (error) {
    res.status(404).json("Error Creating A User");
  }
};


export const getAllUserController = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const users = await prisma.user.findMany();
    console.log(users);
    if (!users) {
      res.status(404).json("Error creating a User");
      return;
    }
    res.status(201).json(users);
  } catch (error) {
    res.status(404).json("Error Creating A User");
  }
};

export const deleteAllUSers = async (req: Request, res: Response) => {
  try {
    console.log("Trying to delete");
    const users = await prisma.user.deleteMany({
      where: { username: "raimudit2003" },
    });
    console.log(users);
    res.status(201).json(users);
  } catch (error) {
    res.status(404).json("Error deleting all User" + error);
  }
};
