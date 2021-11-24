import { makeHttpError, makeValidationError } from '../utils/response-api';
import logger from '../../config/winston';
import { PrismaClientValidationError } from '@prisma/client/runtime';

const errorsPrisma: {[key: string]: string} = {
  UNIQUE: "P2002",
}

const errorsMessagePrisma: {[key: string]: (target: string) => string} = {
  "P2002": (target: string): string => `${target} should be unique.`
}

export default function handleErrors(
  err: any,
  _req: any,
  res: any,
  _next: any
) {
  logger.error(err.message);

  if (err.code === errorsPrisma.UNIQUE) {
    return res
      .status(422)
      .json(makeValidationError(errorsMessagePrisma[err.code](err.meta.target)));
  }

  if (err.type === 'UnprocessableEntityError') {
    return res
      .status(err.statusCode)
      .json(makeValidationError(err.errors));
  }

  /*
    Prisma Client throws a PrismaClientValidationError exception if validation fails.
    for example:
      Missing field - for example, an empty data: {} property when creating a new record
      Incorrect field type provided (for example, setting a Boolean field to "Hello, I like cheese and gold!")
  */
  if (err instanceof PrismaClientValidationError) {
    return res.status(422).json(makeValidationError(err.message));
  }

  // Default
  res.status(err.statusCode || 500).json(makeHttpError({
    message: err.message,
    statusCode: res.statusCode
  }));
}

