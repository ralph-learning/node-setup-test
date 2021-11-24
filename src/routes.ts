import core from 'express';

import users from './modules/users';
import posts from './modules/posts';

export default function routes(app: core.Express) {
  users.usersRoutes(app);
  posts.postsRoutes(app);
}
