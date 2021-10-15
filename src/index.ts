import { PrismaClient } from '@prisma/client'
import express from 'express'

import morganMiddleware from '../config/morgan';
import logger from '../config/winston';
import { success } from './response-api';
import { UnprocessableEntityError, BadRequest } from './utils/errors';
import handleErrors from './middlewares/handle-errors';

const prisma = new PrismaClient()
const app = express()

// app.use(express.json());
app.use(morganMiddleware);

app.get('/posts/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await prisma.posts.findFirst({
      where: { id: Number(id) },
      include: { author: true }
    });

    logger.debug('getPost post', post);

    if (!post) {
      logger.error(`Post ${id} Not found`);
      // throw new BadRequest(`Post ${id} Not found`);
      throw new UnprocessableEntityError('Validation errors', [{email: 'Can not be empty'}]);
    }

    res.json(success('Ok', post));
  } catch (error: any) {
    next(error);
  }
});

app.use(handleErrors);

app.listen(3001, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)

// app.get('/users', async (_req, res) => {
//   try {
//     const users = await prisma.user.findMany();

//     res
//       .status(200)
//       .json(success('Ok', users));
//   } catch(err: any) {
//     logger.error(err);
//     res
//       .status(500)
//       .json(makeError({
//         message: err.message,
//         statusCode: res.statusCode
//       }));
//   }
// });

// app.post('/users', async (req, res) => {
//   try {
//     const newUser = await prisma.user.create({
//       data: { ...req.body }
//     });

//     res
//       .status(201)
//       .json(success('Created', newUser));
//   } catch(err: any) {
//     logger.error(err);

//     res
//       .status(500)
//       .json(makeError({
//         message: err.message,
//         statusCode: res.statusCode
//       }));
//   };
// })

// app.get('/feed', async (_req, res) => {
//   try {
//     const posts = await prisma.posts.findMany({
//       where: { published: true },
//       include: { author: true }
//     });

//     res.json(success("Ok", posts));
//   } catch(err) {
//     res
//       .status(500)
//       .json(makeError({ statusCode: res.statusCode }))
//   }
// });

// app.post('/posts', async (req, res) => {
//   const { title, content, authorEmail } = req.body;
//   const newPost = await prisma.posts.create({
//     data: {
//       title,
//       content,
//       published: false,
//       author: { connect: { email: authorEmail } }
//     }
//   });

//   res.json(newPost);
// });

// app.put('/posts/publish/:id', async (req, res) => {
//   const { id } = req.params;
//   const post = await prisma.posts.update({
//     where: { id: Number(id)},
//     data: {
//       published: true
//     }
//   });

//   res.json(post);
// });

// app.delete('/posts/:id', async (req, res) => {
//   const { id } = req.params;
//   const postDeleted = await prisma.posts.delete({
//     where: { id: Number(id) }
//   });

//   res.json(postDeleted);
// });

// Handle errors
