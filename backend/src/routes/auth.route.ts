import express from 'express';
import { register, login, logout } from '../controllers/authController';

const authRouter = express.Router();

// Registration endpoint
authRouter.post('/register', register);

// Login endpoint
authRouter.post('/login', login);

// Logout endpoint
authRouter.post('/logout', logout);

export default authRouter;
