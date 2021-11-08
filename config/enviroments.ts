import dotenv from 'dotenv';

if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: __dirname + `/../.env.${process.env.NODE_ENV}`,
  });
}
