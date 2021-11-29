import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import logger from '../../../config/winston';

import {
  makeSuccessResponse,
  makeValidationError
} from '../../utils/response-api';
import userService from './users.services';

const secret = process.env.SECRET || 'secret';

export async function index(_req: Request, res: Response) {
  const users = await userService.getAll();

  res.status(200).json(makeSuccessResponse('Ok', users));
}

export async function create(req: Request, res: Response) {
  logger.debug(JSON.stringify(req.body));
  const { name, email, password } = req.body;

  const user = await userService.create({
    name,
    email,
    password
  });

  res.status(201).json(makeSuccessResponse('User created', user));
}

export async function show(req: Request, res: Response) {
  const { id } = req.params;

  const user = await userService.getById(id);

  res.status(200).json(makeSuccessResponse('Ok', user));
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await userService.findByUniqueEmail(email);

  if (!user) {
    return res
      .status(401)
      .json(makeValidationError('Invalid credentials', res.statusCode));
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email }, secret, { expiresIn: '12h' });

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
