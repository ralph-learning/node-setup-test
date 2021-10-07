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

app.post('/users', async (req, res) => {
  const newUser = await prisma.user.create({
    data: { ...req.body }
  });
  res.json(newUser);
})

app.get('/feed', async (_req, res) => {
  const posts = await prisma.posts.findMany({
    where: { published: true },
    include: { author: true }
  });

  res.json(posts);
});

app.get('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const post = await prisma.posts.findFirst({
    where: { id: Number(id) },
    include: { author: true }
  });

  res.json(post);
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

  res.json(newPost);
});

app.put('/posts/publish/:id', async (req, res) => {
  const { id } = req.params;
  const post = await prisma.posts.update({
    where: { id: Number(id)},
    data: {
      published: true
    }
  });

  res.json(post);
});

app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const postDeleted = await prisma.posts.delete({
    where: { id: Number(id) }
  });

  res.json(postDeleted);
});

app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)