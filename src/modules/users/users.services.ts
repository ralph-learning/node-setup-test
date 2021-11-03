import { User } from '@prisma/client';
import prisma from '../../../config/db';

async function getAll() {
  return await prisma.user.findMany();
}

async function create(user: Omit<User, 'id'>) {
  const newUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
    },
  });

  return newUser;
}

export default {
  getAll,
  create
};
