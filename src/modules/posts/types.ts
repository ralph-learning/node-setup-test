import { Posts } from '@prisma/client';

export interface CreatePostInput extends Pick<Posts, 'title' | 'content'> {
  authorEmail: string;
}