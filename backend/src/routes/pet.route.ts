import express from 'express';
import { registerPet, getPetProfile } from '../controllers/petController';
import { authenticate } from '../middleware/authMiddleware';

const petRouter = express.Router();

// Protected route to register a pet
petRouter.post('/register', authenticate, registerPet);

// Public route to get pet profile by name
petRouter.get('/:name', getPetProfile);

export default petRouter;
