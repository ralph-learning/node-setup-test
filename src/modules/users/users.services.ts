import { validateUser } from './users.validations';

import prisma from '../../../config/db';
import { UnprocessableEntityError } from '../../utils/errors';
import { CreateUserInput } from './types';
import logger from '../../../config/winston';

async function getAll() {
  return await prisma.user.findMany();
}

async function getById(id: string) {
  const user = await prisma.user.findFirst({ where: { id: Number(id) } });

  return user;
}

async function create(user: CreateUserInput) {
  const userValidationErrors = validateUser(user);

  if (userValidationErrors.length > 0) {
    throw new UnprocessableEntityError(
      'Validation error',
      userValidationErrors
    );
  }

  const newUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email
    }
  });

  logger.debug(`User created: ${JSON.stringify(newUser)}`);

  return newUser;
}

export default {
  getAll,
  getById,
  create
};
