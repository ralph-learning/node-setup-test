import { Request, Response } from 'express';

import { makeSuccessResponse } from '../../utils/response-api';
import postsService from './post.service';
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

  const newPost = await postService.create({ title, content, authorEmail });

  res.json(makeSuccessResponse("Post created", newPost));
}

async function publish(req: Request, res: Response) {
  const { id } = req.params;

  const postPublished = await postService.publish(Number(id));

  res.json(makeSuccessResponse("Post published", postPublished));
}

async function remove(req: Request, res: Response) {
  const { id } = req.params;
  const postDeleted = await postService.remove(Number(id));

  res.status(200).json(makeSuccessResponse("Post deleted", postDeleted));
}

export default {
  create,
  index,
  publish,
  remove,
  show,
}