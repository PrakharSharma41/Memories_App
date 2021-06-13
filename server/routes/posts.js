import express from 'express';

import { getPosts, getPostsBySearch, getPost, createPost, updatePost, likePost, deletePost } from '../controllers/posts.js';

const router = express.Router();
import auth from "../middleware/auth.js";

// all of these routes begin with /posts
router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPost);

router.post('/', auth,  createPost);// to create a post user needs to be authorized first
router.patch('/:id', auth, updatePost);// patch is used for updating existing document
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);// user can only like once 

export default router;