import { Request, Response } from 'express';

import postsService from './post.service';
import { makeSuccessResponse } from '../../utils/response-api';
import prisma from '../../../config/db';
import postService from './post.service';

export async function index(_req: Request, res: Response) {
  const posts = await postsService.getAll();

  res.json(makeSuccessResponse("Ok", posts));
}

export async function show(req: Request, res: Response) {
  const { id } = req.params;
  const post = await postService.getFirst(Number(id));

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
  const postDeleted = await prisma.posts.delete({
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