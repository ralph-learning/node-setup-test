import prisma from '../../../config/db';
import logger from '../../../config/winston';
import { NotFound } from '../../utils/errors';

async function getAll() {
  const posts = await prisma.posts.findMany({
    where: { published: true },
    include: { author: true },
  });

  return posts;
}

async function getFirst(id: number) {
  const post = await prisma.posts.findFirst({
    where: { id },
    include: { author: true },
  });

  if (!post) {
    logger.error(`Post ${id} Not found`);
    throw new NotFound(`Post ${id} Not found`);
  }

  return post;
}

export default {
  getAll,
  getFirst
};

