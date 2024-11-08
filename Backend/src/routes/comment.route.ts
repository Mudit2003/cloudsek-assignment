import express from "express";
import { createCommentController } from "../controllers/comment.controller";
import { getPostWithComments } from "../services/post.service";
const router = express.Router();

// Route to add a comment
router.post("/", createCommentController);

// Route to get comments for a post
// router.get("/:postId", getCommentforPosts);


export default router