import joi from 'joi';

import { CreateUserInput } from './types';

const userSchema = joi.object().keys({
  name: joi.string(),
  email: joi.string().email().required(),
  password: joi.string().required()
});

export function validateUser(user: CreateUserInput): string[] {
  return (
    userSchema
      .validate(user, { abortEarly: false })
      .error?.details.map(({ message }) => message) ?? []
  );
}
