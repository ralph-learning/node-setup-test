import { Express } from 'express';
import auth from '../../middlewares/auth';

import postsController from './posts.controller';

export default function (app: Express) {
  app.get('/profile', auth, postsController.profile);
  app.get('/feed', auth, postsController.index);
  app.get('/posts/:id', postsController.show);
  app.post('/posts', postsController.create);
  app.put('/posts/publish/:id', postsController.publish);
  app.delete('/posts/:id', postsController.remove);
}
