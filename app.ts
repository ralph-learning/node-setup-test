import express from 'express'
import 'express-async-errors';

import morganMiddleware from './config/morgan';

import handleErrors from './src/middlewares/handle-errors';
import routes from './src/routes';

const app = express()

app.use(express.json());
app.use(morganMiddleware);

routes(app);

app.use(handleErrors);

export default app;

