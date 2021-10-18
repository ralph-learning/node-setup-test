import { PrismaClient } from '@prisma/client'
import express from 'express'
import 'express-async-errors';

import morganMiddleware from '../config/morgan';
import logger from '../config/winston';
import { makeSuccessResponse } from './response-api';
import { NotFound } from './utils/errors';
import handleErrors from './middlewares/handle-errors';

const prisma = new PrismaClient()
const app = express()

app.use(express.json());
app.use(morganMiddleware);

app.get('/posts/:id', async (req, res, next) => {
  const { id } = req.params;

  const post = await prisma.posts.findFirst({
    where: { id: Number(id) },
    include: { author: true }
  });

  if (!post) {
    logger.error(`Post ${id} Not found`);
    throw new NotFound(`Post ${id} Not found`);
  }

  res.json(makeSuccessResponse('Ok', post));
});

app.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany();

  res.status(200).json(makeSuccessResponse("Ok", users));
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
    }
  });

  res
    .status(201)
    .json(makeSuccessResponse('User created', newUser));
})

app.get("/feed", async (_req, res) => {
  const posts = await prisma.posts.findMany({
    where: { published: true },
    include: { author: true },
  });

  res.json(makeSuccessResponse("Ok", posts));
});

app.post('/posts', async (req, res) => {
  const { title, content, authorEmail } = req.body;
  const newPost = await prisma.posts.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } }
    }
  });

  res.json(makeSuccessResponse("Post created", newPost));
});

app.put('/posts/publish/:id', async (req, res) => {
  const { id } = req.params;

  // TODO: Should it exists?
  const postAlreadyPublished = await prisma.posts.findFirst({
    where: {
      id: Number(id),
      published: true
     },
  });
  if (postAlreadyPublished) {
    return res
      .status(304)
      .send()
  }

  const post = await prisma.posts.update({
    where: { id: Number(id) },
    data: {
      published: true
    }
  });

  res.json(makeSuccessResponse("Post published", post));
});

app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;

  const postDeleted = await prisma.posts.delete({
    where: { id: Number(id) }
  });

  res
    .status(200)
    .json(makeSuccessResponse("Post deleted", postDeleted));
});

app.use(handleErrors);

app.listen(3001, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)