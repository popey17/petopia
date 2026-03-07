import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import prisma from '../lib/prisma';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '../lib/r2';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';

const uploadToR2 = async (file: Express.Multer.File): Promise<string> => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const fileName = `posts/${uniqueSuffix}${path.extname(file.originalname)}`;
  
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return `${R2_PUBLIC_URL}/${fileName}`;
};

const deleteFromR2 = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the key from the public URL
    // Public URL format: https://pub-xxx.r2.dev/posts/filename.ext
    const fileName = imageUrl.split(`${R2_PUBLIC_URL}/`)[1];
    
    if (!fileName) return;

    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileName,
      })
    );
  } catch (error) {
    console.error('Delete from R2 error:', error);
    // We don't throw here to avoid failing the whole post deletion if R2 fails
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { petId, caption } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!petId) {
      return res.status(400).json({ message: 'petId is required' });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if the pet exists and is owned by the user
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this pet' });
    }

    // Upload files to R2 in parallel
    const uploadPromises = files.map((file) => uploadToR2(file));
    const imageUrls = await Promise.all(uploadPromises);

    // Create the post and its images in a transaction
    const post = await prisma.post.create({
      data: {
        caption,
        petId,
        images: {
          create: imageUrls.map((url) => ({
            url,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    console.error('Create post error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPetPosts = async (req: AuthRequest, res: Response) => {
  try {
    const petId = req.params.petId as string;

    if (!petId) {
      return res.status(400).json({ message: 'petId is required' });
    }

    const posts = await prisma.post.findMany({
      where: { petId },
      include: {
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(posts);
  } catch (error) {
    console.error('Get pet posts error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.postId as string;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        images: true,
        pet: {
          select: {
            name: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error('Get post error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const postId = req.params.postId as string;

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if the post exists and user owns it (via pet ownership)
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        images: true,
        pet: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.pet.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to delete this post' });
    }

    // Delete images from R2
    const deletePromises = post.images.map((img) => deleteFromR2(img.url));
    await Promise.all(deletePromises);

    // Delete post from database (cascades to post_images due to schema)
    await prisma.post.delete({
      where: { id: postId },
    });

    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
