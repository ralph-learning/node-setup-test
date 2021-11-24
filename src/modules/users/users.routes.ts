import core from 'express';

import usersController from "./users.controller";

export default function (app: core.Express) {
  app.get("/users", usersController.index);
  app.get("/users/:id", usersController.show);
  app.post("/users", usersController.create);
}

