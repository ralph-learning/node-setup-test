import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const newUser = await prisma.user.create({
    data: {
      name: "john",
      email: "john@example.com",
      posts: {
        create: {
          title: "Hello World",
        },
      },
    },
  });

  console.log('newUser', newUser)

  const allUsers = await prisma.user.findMany({ include: {posts: true}});
  console.log(allUsers)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
