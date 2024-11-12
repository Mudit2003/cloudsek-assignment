import express from "express";
import {
  createCommentController,
  deleteCommentController,
  getCommentByPostController,
  getCommentController,
  updateCommentController,
} from "../controllers/comment.controller";
import commentSchema from "../validation/comment.schema";
import validate from "../middlewares/validate.middleware";

const router = express.Router();

// Route to add a comment
router.post("/", validate(commentSchema), createCommentController);
router.get("/:id", getCommentController);
router.put("/:id", validate(commentSchema.partial()), updateCommentController);
router.delete("/:id", deleteCommentController);
router.post("/post/:postId", getCommentByPostController);

// Route to get comments for a post
// router.get("/:postId", getCommentforPosts);

export default router;
