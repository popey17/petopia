import express from 'express';
import authRoute from './auth.route';
import petRoute from './pet.route';
import postRoute from './post.route';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/pets', petRoute);
router.use('/posts', postRoute);

export default router;
