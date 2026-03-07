import { Router } from 'express';
import { createPost, getPetPosts, getPost, deletePost } from '../controllers/postController';
import { authenticate } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Post images for a pet (up to 10 images)
router.post('/', authenticate, upload.array('images', 10), createPost);

// Get all posts for a pet
router.get('/pet/:petId', getPetPosts);

// Get a single post
router.get('/:postId', getPost);

// Delete a post
router.delete('/:postId', authenticate, deletePost);

export default router;
