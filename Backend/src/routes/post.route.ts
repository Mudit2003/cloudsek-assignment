import express from "express";
import {
  getAllPostsController,
  createPostController,
  deletePostController,
  getPostByIdController,
  updatePostController,
  getUsersPost,
} from "../controllers/post.controller";
import validate from "../middlewares/validate.middleware";
import { postSchema } from "../validation/post.schema";

const router = express.Router();
// Route to create a post
// Route to create a new post
router.post("/", validate(postSchema), createPostController);

// Route to retrieve all posts
router.get("/", getAllPostsController);
router.get("/user" , getUsersPost);
router.get("/:id", getPostByIdController);

// Route to retrieve a single post by ID


// Route to update a post by ID
router.put("/:id", validate(postSchema.partial()), updatePostController);

// Route to delete a post by ID
router.delete("/:id", deletePostController);

export default router;
