import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../lib/prisma';

export const registerPet = async (req: AuthRequest, res: Response) => {
  try {
    const { name, displayName, bio, species, breed, gender, birthDate, location } = req.body;

    if (!name || !displayName || !species || !breed || !gender) {
      return res.status(400).json({ message: 'Missing required fields: name, displayName, species, breed, gender' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if pet name is already taken
    const existingPet = await prisma.pet.findUnique({
      where: { name },
    });

    if (existingPet) {
      return res.status(400).json({ message: 'A pet with this name already exists' });
    }

    const ownerId = req.user.id;

    // Use a transaction to ensure both pet creation and user update succeed
    const result = await prisma.$transaction(async (tx) => {
      const pet = await tx.pet.create({
        data: {
          name,
          displayName,
          bio,
          species,
          breed,
          gender,
          birthDate: birthDate ? new Date(birthDate) : null,
          location,
          ownerId,
        },
      });

      // Check if user already has a default pet
      const user = await tx.user.findUnique({
        where: { id: ownerId },
        select: { defaultPetId: true },
      });

      if (!user?.defaultPetId) {
        await tx.user.update({
          where: { id: ownerId },
          data: { defaultPetId: pet.id },
        });
      }

      return pet;
    });

    return res.status(201).json({
      message: 'Pet registered successfully',
      pet: result,
    });
  } catch (error) {
    console.error('Pet registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
