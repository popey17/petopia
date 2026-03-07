import express from 'express';
import { registerPet } from '../controllers/petController';
import { authenticate } from '../middleware/authMiddleware';

const petRouter = express.Router();

// Protected route to register a pet
petRouter.post('/register', authenticate, registerPet);

export default petRouter;
