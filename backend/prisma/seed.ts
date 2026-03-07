import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  console.log('Seeding database...');

  const users = [
    {
      email: 'john.doe@example.com',
      password: 'password123',
      isVerified: true,
    },
    {
      email: 'test@gmail.com',
      password: 'password',
      isVerified: true,
    },
    {
      email: 'jane.smith@example.com',
      password: 'password456',
      isVerified: false,
    },
  ];

  const saltRounds = 10;

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        password: hashedPassword,
      },
      create: {
        ...userData,
        password: hashedPassword,
      },
    });
    console.log(`Created/Updated user: ${user.email}`);
  }

  const user1 = await prisma.user.findUnique({ where: { email: 'john.doe@example.com' } });
  const user2 = await prisma.user.findUnique({ where: { email: 'test@gmail.com' } });

  if (user1 && user2) {
    const pets = [
      {
        name: 'Buddy',
        displayName: 'Buddy the Golden',
        bio: 'Just a good boy looking for treats.',
        species: 'Dog',
        breed: 'Golden Retriever',
        gender: 'Male',
        birthDate: new Date('2020-05-15'),
        location: 'Petopia Center',
        ownerId: user1.id,
      },
      {
        name: 'Mittens',
        displayName: 'Mittens the Cat',
        bio: 'I love to sleep and hunt mice.',
        species: 'Cat',
        breed: 'Siamese',
        gender: 'Female',
        birthDate: new Date('2021-08-20'),
        location: 'Cozy Home',
        ownerId: user2.id,
      },
    ];

    for (const petData of pets) {
      const pet = await prisma.pet.upsert({
        where: { name: petData.name },
        update: {},
        create: petData,
      });
      console.log(`Created/Updated pet: ${pet.name}`);

      // Set as default pet for the owner
      await prisma.user.update({
        where: { id: pet.ownerId },
        data: { defaultPetId: pet.id },
      });
      console.log(`Set ${pet.name} as default pet for user: ${pet.ownerId}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
