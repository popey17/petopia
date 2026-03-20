import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../lib/prisma';

export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.postId as string;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get current user's default pet
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { defaultPetId: true },
    });

    if (!user?.defaultPetId) {
      return res.status(400).json({ message: 'User has no default pet. Please create a pet first.' });
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create like (@@unique on [postId, petId] prevents duplicates)
    await prisma.like.upsert({
      where: {
        postId_petId: {
          postId,
          petId: user.defaultPetId,
        },
      },
      create: {
        postId,
        petId: user.defaultPetId,
      },
      update: {}, // Do nothing if already liked
    });

    return res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Like post error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const unlikePost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.postId as string;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Get current user's default pet
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { defaultPetId: true },
    });

    if (!user?.defaultPetId) {
      return res.status(400).json({ message: 'User has no default pet' });
    }

    // Delete like
    await prisma.like.deleteMany({
      where: {
        postId,
        petId: user.defaultPetId,
      },
    });

    return res.status(200).json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error('Unlike post error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
