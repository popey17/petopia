import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../lib/prisma';

export const followPet = async (req: AuthRequest, res: Response) => {
  const { followerId } = req.body;
  const followingId = req.params.petId as string;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!followerId) {
    return res.status(400).json({ message: 'Follower pet ID is required' });
  }

  try {
    // Verify user owns the follower pet
    const followerPet = await prisma.pet.findFirst({
      where: {
        id: followerId,
        ownerId: userId,
      },
    });

    if (!followerPet) {
      return res.status(403).json({ message: 'You do not own the follower pet' });
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this pet' });
    }

    await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    res.status(200).json({ message: 'Successfully followed pet' });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const unfollowPet = async (req: AuthRequest, res: Response) => {
  const { followerId } = req.body;
  const followingId = req.params.petId as string;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!followerId) {
    return res.status(400).json({ message: 'Follower pet ID is required' });
  }

  try {
    // Verify user owns the follower pet
    const followerPet = await prisma.pet.findFirst({
      where: {
        id: followerId,
        ownerId: userId,
      },
    });

    if (!followerPet) {
      return res.status(403).json({ message: 'You do not own the follower pet' });
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    res.status(200).json({ message: 'Successfully unfollowed pet' });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFollowers = async (req: AuthRequest, res: Response) => {
  const petId = req.params.petId as string;
  const userId = req.user?.id;

  try {
    let defaultPetId: string | null = null;
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { defaultPetId: true },
      });
      defaultPetId = user?.defaultPetId || null;
    }

    const followers = await prisma.follow.findMany({
      where: { followingId: petId },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
            displayName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const followerPets = await Promise.all(
      followers.map(async (f: any) => {
        const pet = f.follower;
        let isFollowing = false;
        if (defaultPetId && defaultPetId !== pet.id) {
          const follow = await prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: defaultPetId,
                followingId: pet.id,
              },
            },
          });
          isFollowing = !!follow;
        }
        return { ...pet, isFollowing };
      })
    );

    res.status(200).json(followerPets);
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFollowing = async (req: AuthRequest, res: Response) => {
  const petId = req.params.petId as string;
  const userId = req.user?.id;

  try {
    let defaultPetId: string | null = null;
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { defaultPetId: true },
      });
      defaultPetId = user?.defaultPetId || null;
    }

    const followingEntries = await prisma.follow.findMany({
      where: { followerId: petId },
      include: {
        following: {
          select: {
            id: true,
            name: true,
            displayName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const followingPets = await Promise.all(
      followingEntries.map(async (f: any) => {
        const pet = f.following;
        let isFollowing = false;
        if (defaultPetId && defaultPetId !== pet.id) {
          const follow = await prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: defaultPetId,
                followingId: pet.id,
              },
            },
          });
          isFollowing = !!follow;
        }
        return { ...pet, isFollowing };
      })
    );

    res.status(200).json(followingPets);
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
