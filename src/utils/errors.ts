class HttpError extends Error {
  type = 'HttpError';
  constructor(public message: string) {
    super(message);
  }
}

export class BadRequest extends HttpError {
  type = 'BadRequest';
  statusCode = 400;
}

export class NotFound extends HttpError {
  type = 'NotFound';
  statusCode = 404;
}

export class GeneralError extends HttpError {
  type = 'GeneralError';
  statusCode = 500;
}

export class UnprocessableEntityError extends HttpError {
  type = 'UnprocessableEntityError';
  statusCode = 422;

  constructor(message: string, public errors: string[]) {
    super(message);
    this.errors = errors;
  }
}
