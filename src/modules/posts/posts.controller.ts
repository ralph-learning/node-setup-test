import { Request, Response } from 'express';

import { makeSuccessResponse } from '../../utils/response-api';
import postsService from './posts.service';

export async function index(_req: Request, res: Response) {
  const posts = await postsService.getAll();

  res.json(makeSuccessResponse("Ok", posts));
}

export async function show(req: Request, res: Response) {
  const { id } = req.params;
  const post = await postsService.getFirst(Number(id));

  res.json(makeSuccessResponse("Ok", post));
}

async function create(req: Request, res: Response) {
  const { title, content, authorEmail } = req.body;

  const newPost = await postsService.create({ title, content, authorEmail });

  res
    .status(201)
    .json(makeSuccessResponse("Post created", newPost));
}

async function publish(req: Request, res: Response) {
  const { id } = req.params;

  const postPublished = await postsService.publish(Number(id));

  res.json(makeSuccessResponse("Post published", postPublished));
}

async function remove(req: Request, res: Response) {
  const { id } = req.params;
  const postDeleted = await postsService.remove(Number(id));

  res.status(200).json(makeSuccessResponse("Post deleted", postDeleted));
}

export default {
  create,
  index,
  publish,
  remove,
  show,
}
