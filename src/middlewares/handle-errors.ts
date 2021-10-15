import { makeHttpError, makeValidationError } from '../response-api';
import { HttpErrorsException } from '../utils/errors'

export default function handleErrors(
  err: HttpErrorsException,
  _req: any,
  res: any,
  _next: any
) {
  if (err.statusCode === 422) {
    return res
      .status(err.statusCode)
      .json(makeValidationError([]))
  }

  res.status(err.statusCode || 500).json(makeHttpError({
    message: err.message,
    statusCode: res.statusCode,
    stack: err.stack
  }));
}
