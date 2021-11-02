import { Posts } from '@prisma/client';

export type PostCreateInput = Pick<Posts, 'title' | 'content'> & { authorEmail: string };
