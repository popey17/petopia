import express from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const authRouter = express.Router();

// Registration endpoint
authRouter.post('/register', register);

// Login endpoint
authRouter.post('/login', login);

// Logout endpoint
authRouter.post('/logout', logout);

// Get current user session
authRouter.get('/me', authenticate as any, getCurrentUser as any);

export default authRouter;
