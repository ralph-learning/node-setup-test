export function success(message: string, results: any) {
  return {
    message,
    error: false,
    data: results
  }
};

const HTTP_ERROS: {[key: number]: string} = {
  400: 'Bad Request',
  401: 'Unauthorized',
  404: 'Not Found',
  403: 'Forbidden',
  422: 'Unprocessable Entity',
  500: 'Internal Server Error'
};

export function makeHttpError({
  message = 'Something went wrong',
  statusCode = 500,
  stack
}: {
  message?: string;
  statusCode?: number;
  stack?: string
}) {
  return {
    message,
    code: HTTP_ERROS[statusCode],
    stack
  }
}

export function makeValidationError(errors: any) {
  return {
    code: "Validation errors",
    errors
  };
};
