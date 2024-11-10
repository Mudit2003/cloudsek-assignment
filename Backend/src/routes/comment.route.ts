import express from "express";
import {
  createCommentController,
  deleteCommentController,
  getCommentByPostController,
  getCommentController,
  updateCommentController,
} from "../controllers/comment.controller";

const router = express.Router();

// Route to add a comment
router.post("/", createCommentController);
router.get("/:id", getCommentController);
router.put("/:id", updateCommentController);
router.delete("/:id", deleteCommentController);
router.post("/post/:postId", getCommentByPostController);

// Route to get comments for a post
// router.get("/:postId", getCommentforPosts);

export default router;
