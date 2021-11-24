import { makeHttpError, makeValidationError } from '../utils/response-api';
import logger from '../../config/winston';

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

  res.status(err.statusCode || 500).json(makeHttpError({
    message: err.message,
    statusCode: res.statusCode
  }));
}

