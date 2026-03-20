import express from 'express';
import { registerPet, getPetProfile } from '../controllers/petController';
import { followPet, unfollowPet, getFollowers, getFollowing } from '../controllers/followController';
import { authenticate } from '../middleware/authMiddleware';

const petRouter = express.Router();

// Protected route to register a pet
petRouter.post('/register', authenticate, registerPet);

// Protected route to get pet profile by name
petRouter.get('/:name', authenticate, getPetProfile);

// Follow/Unfollow routes
petRouter.post('/:petId/follow', authenticate, followPet);
petRouter.delete('/:petId/follow', authenticate, unfollowPet);
petRouter.get('/:petId/followers', authenticate, getFollowers);
petRouter.get('/:petId/following', authenticate, getFollowing);

export default petRouter;
