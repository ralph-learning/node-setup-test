import prisma from '../../../config/db';
import { makeSuccessResponse } from '../../utils/response-api';

export async function index(_req: any, res:  any) {
  // TODO: extract to DAL layer
  const users = await prisma.user.findMany();

  res.status(200).json(makeSuccessResponse("Ok", users));
}

export async function create(req: any, res: any) {
  const { name, email } = req.body;

  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
    },
  });

  res.status(201).json(makeSuccessResponse("User created", newUser));
}

export default {
  index,
  create
}