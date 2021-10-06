import { PrismaClient } from '@prisma/client'
import express from 'express'
import { resolve } from 'path/posix'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/feed', async (_req, res) => {
  const posts = await prisma.posts.findMany({
    where: { published: true },
    include: { author: true }
  });

  res.json(posts);
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const post = await prisma.posts.findFirst({
    where: { id: parseInt(id) },
    include: { author: true }
  });

  res.json(post);
});

app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)