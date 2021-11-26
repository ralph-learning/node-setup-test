import prisma from '../config/db';

export async function clearData() {
  try {
    await prisma.posts.deleteMany({});
    await prisma.user.deleteMany({});
  } catch (error) {
    console.log(error);
  }
}
