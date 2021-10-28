import { makeHttpError, makeValidationError } from '../utils/response-api';
import logger from '../../config/winston';

export default function handleErrors(
  err: any,
  _req: any,
  res: any,
  _next: any
) {
  if (err.code === "P2025") {
    logger.error(err.meta.cause);

    return res
      .status(404)
      .json({
        message: err.meta.cause,
        code: err.code
      })
  }

  if (err.type === 'UnprocessableEntityError') {
    logger.error(err.type, err.errors);

    return res
      .status(err.statusCode)
      .json(makeValidationError(err.errors));
  }

  logger.error(err.message);

  res.status(err.statusCode || 500).json(makeHttpError({
    message: err.message,
    statusCode: res.statusCode
  }));
}
