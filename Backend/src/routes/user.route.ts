import { Router } from "express";
import { createUserController, deleteAllUSers, getAllUserController } from "../controllers/user.controller";

const router = Router();

router.post("/", createUserController);
router.get("/", getAllUserController);
router.delete("/", deleteAllUSers);

export default router;
