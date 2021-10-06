import { PrismaClient } from '@prisma/client'
import express from 'express'
import { resolve } from 'path/posix'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
})

app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)