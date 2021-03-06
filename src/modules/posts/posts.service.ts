import prisma from '../../../config/db';
import logger from '../../../config/winston';
import { NotFound } from '../../utils/errors';

import { CreatePostInput } from './types';

async function getAll() {
  const posts = await prisma.posts.findMany({
    where: { published: true },
    include: { author: true }
  });

  return posts;
}

async function getFirst(id: number) {
  const post = await prisma.posts.findFirst({
    where: { id },
    include: { author: true }
  });

  if (!post) {
    logger.error(`Post ${id} Not found`);
    throw new NotFound(`Post ${id} Not found`);
  }

  return post;
}

async function create({ title, content, authorEmail }: CreatePostInput) {
  const newPost = await prisma.posts.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } }
    }
  });

  return newPost;
}

async function publish(id: number) {
  const post = await prisma.posts.update({
    where: { id },
    data: { published: true }
  });

  return post;
}

async function remove(id: number) {
  const postDeleted = await prisma.posts.delete({
    where: { id }
  });

  return postDeleted;
}

export default {
  create,
  getAll,
  getFirst,
  publish,
  remove
};
