import { PrismaClient } from '@prisma/client'
import { NotFound } from '../src/utils/errors'

const prismaClientPropertyName = `__prevent-name-collision__prisma`
type GlobalThisWithPrismaClient = typeof globalThis & {
  [prismaClientPropertyName]: PrismaClient
}

// Arguments for PrismaClient constructor:
const prismaConfig: any = {
  errorFormat: 'minimal',
  rejectOnNotFound: {
    findFirst: (error: any) => new NotFound(error.message),
  },
}

const getPrismaClient = () => {
  if (process.env.NODE_ENV === `production`) {
    return new PrismaClient(prismaConfig)
  } else {
    const newGlobalThis = globalThis as GlobalThisWithPrismaClient
    if (!newGlobalThis[prismaClientPropertyName]) {
      newGlobalThis[prismaClientPropertyName] = new PrismaClient(prismaConfig)
    }
    return newGlobalThis[prismaClientPropertyName]
  }
}

const prisma = getPrismaClient()

export default prisma