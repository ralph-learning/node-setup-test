import { makeHttpError, makeValidationError } from '../utils/response-api';
import logger from '../../config/winston';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError
} from '@prisma/client/runtime';
import express from 'express';

const PRISMA_ERROR_CODE: { [key: string]: string } = {
  UNIQUE: 'P2002',
  NOT_FOUND: 'P2025'
};

const errorsMessagePrisma: { [key: string]: (target: string) => string } = {
  P2002: (target: string): string => `${target} should be unique.`
};

export default function handleErrors(
  err: any,
  _req: express.Request,
  res: express.Response,
  _next: express.RequestHandler
) {
  logger.error(err.message);

  if (err.type === 'UnprocessableEntityError') {
    return res.status(err.statusCode).json(makeValidationError(err.errors));
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

  /*
    Prisma Client throws a PrismaClientKnownRequestError exception if the query engine returns
    a known error related to the request.
    for example:
      a unique constraint violation.
  */
  if (err instanceof PrismaClientKnownRequestError) {
    let responseBody;
    const meta: any = err.meta;

    if (err.code === PRISMA_ERROR_CODE.NOT_FOUND) {
      responseBody = makeValidationError(meta.cause);

      res.status(404);
    }

    if (err.code === PRISMA_ERROR_CODE.UNIQUE) {
      responseBody = makeValidationError(
        errorsMessagePrisma[err.code](meta.target)
      );

      res.status(422);
    }

    return res.json(responseBody);
  }

  // Default
  res.status(err.statusCode || 500).json(
    makeHttpError({
      message: err.message,
      statusCode: res.statusCode
    })
  );
}
