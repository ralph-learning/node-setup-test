import { Request, Response } from 'express';

import { makeSuccessResponse } from '../../response-api';
import prisma from '../../db';
import logger from '../../../config/winston';
import { NotFound } from '../../utils/errors';

export async function index(_req: Request, res: Response) {
  const posts = await prisma.posts.findMany({
    where: { published: true },
    include: { author: true },
  });

  res.json(makeSuccessResponse("Ok", posts));
}

export async function show(req: Request, res: Response) {
  const { id } = req.params;

  const post = await prisma.posts.findFirst({
    where: { id: Number(id) },
    include: { author: true },
  });

  if (!post) {
    logger.error(`Post ${id} Not found`);
    throw new NotFound(`Post ${id} Not found`);
  }

  res.json(makeSuccessResponse("Ok", post));
}

async function create(req: Request, res: Response) {
  const { title, content, authorEmail } = req.body;
  const newPost = await prisma.posts.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } },
    },
  });

  res.json(makeSuccessResponse("Post created", newPost));
}

async function publish(req: Request, res: Response) {
  const { id } = req.params;
  const post = await prisma.posts.update({
    where: { id: Number(id) },
    data: { published: true },
  });

  res.json(makeSuccessResponse("Post published", post));
}

async function remove(req: Request, res: Response) {
  const { id } = req.params;
  const post = await prisma.posts.delete({
    where: { id: Number(id) },
  });

  res.status(200).json(makeSuccessResponse("Post deleted", postDeleted));
}

export default {
  index,
  show,
  create,
  publish,
  remove
}