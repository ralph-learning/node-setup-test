import { Express } from 'express';

import postsController from './posts-controller';

export default function (app: Express) {
  app.get("/feed", postsController.index);
  app.get("/posts/:id", postsController.show);
  app.post("/posts", postsController.create);
  app.put("/posts/publish/:id", postsController.publish);
  app.delete("/posts/:id", postsController.remove);
}