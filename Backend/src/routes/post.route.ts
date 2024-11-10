import express from 'express'
import { getAllPostsController , createPostController, deletePostController, getPostByIdController, updatePostController } from '../controllers/post.controller';

const router = express.Router()
// Route to create a post
// Route to create a new post
router.post('/', createPostController);

// Route to retrieve all posts
router.get('/', getAllPostsController);

// Route to retrieve a single post by ID
router.get('/:id', getPostByIdController);

// Route to update a post by ID
router.put('/:id', updatePostController);

// Route to delete a post by ID
router.delete('/:id', deletePostController);


export default router