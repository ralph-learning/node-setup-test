import express from 'express'
import 'express-async-errors';

import morganMiddleware from '../config/morgan';

import handleErrors from './middlewares/handle-errors';
import routes from './routes';

const app = express()


app.use(express.json());
app.use(morganMiddleware);

routes(app);

app.use(handleErrors);

// TODO: extract to bin/www (?)
app.listen(process.env.PORT || '3000', () =>
  console.log('REST API server ready at: http://localhost:3000'),
);