class HttpError extends Error {
  constructor(public message: string) {
    super(message);
    // this.message = message;
  }
}

export class BadRequest extends HttpError {
  statusCode = 400;
}

export class NotFound extends HttpError {
  statusCode = 404;

  constructor(public message: string) {
    super(message);
  }
}

export class GeneralError extends HttpError {
  statusCode = 500;
}

export class UnprocessableEntityError extends HttpError {
  statusCode = 422;

  constructor(message: string, public errors: object[]) {
    super(message);
  }
}

export type HttpErrorsException = NotFound | BadRequest | GeneralError | UnprocessableEntityError;