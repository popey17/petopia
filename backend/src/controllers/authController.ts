import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create user in Neon DB
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user in Neon DB with pets
    const user = await prisma.user.findUnique({
      where: { email },
      include: { defaultPet: true, pets: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('FATAL ERROR: JWT_SECRET environment variable is not defined.');
    }
    
    // Create JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: '7d',
    });

    // Set cookie
    res.cookie('Jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: (24 * 60 * 60 * 1000) * 7,
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('Jwt');
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
