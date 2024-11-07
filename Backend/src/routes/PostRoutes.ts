import express from 'express'
import { createPostController, getPostController } from '../controllers/PostController';

const router = express.Router()
// Route to create a post
router.post("/", createPostController);

// Route to get all posts
router.get("/", getPostController);

export default router