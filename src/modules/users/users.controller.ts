import { Request, Response } from 'express';

import { makeSuccessResponse } from '../../utils/response-api';
import userService from './users.services';

export async function index(_req: any, res:  any) {
  const users = await userService.getAll();

  res.status(200).json(makeSuccessResponse("Ok", users));
}

export async function create(req: Request, res: Response) {
  const { name, email } = req.body;

  const user = await userService.create({ name, email });

  res.status(201).json(makeSuccessResponse("User created", user));
}

export default {
  index,
  create
}
