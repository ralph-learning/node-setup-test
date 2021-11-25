import { User } from '@prisma/client';

export interface CreateUserInput extends Pick<User, 'name' | 'email'> {}
