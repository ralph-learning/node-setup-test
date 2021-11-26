import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../../../config/winston';

import {
  makeSuccessResponse,
  makeValidationError
} from '../../utils/response-api';
import userService from './users.services';

const secret = process.env.SECRET || 'secret';

export async function index(_req: any, res: any) {
  const users = await userService.getAll();

  res.status(200).json(makeSuccessResponse('Ok', users));
}

export async function create(req: Request, res: Response) {
  logger.debug(JSON.stringify(req.body));
  const { name, email } = req.body;

  const user = await userService.create({ name, email });

  res.status(201).json(makeSuccessResponse('User created', user));
}

export async function show(req: Request, res: Response) {
  const { id } = req.params;

  const user = await userService.getById(id);

  res.status(200).json(makeSuccessResponse('Ok', user));
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ username }, secret, { expiresIn: '1h' });

    res.status(200).json(makeSuccessResponse('Ok', { token }));
  }

  res
    .status(401)
    .json(makeValidationError('Invalid credentials.', res.statusCode));
}

export default {
  index,
  show,
  create,
  login
};
