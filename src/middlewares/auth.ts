import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { makeHttpError } from '../utils/response-api';
import logger from '../../config/winston';

const SECRET = process.env.SECRET || 'secret';

export interface RequestUser extends Request {
  user?: string | JwtPayload;
}

export default function verifyToken(
  req: RequestUser,
  res: Response,
  next: NextFunction
) {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) {
    logger.error('No token provided');

    return res.status(403).json(
      makeHttpError({
        message: 'No token provided',
        statusCode: res.statusCode
      })
    );
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
  } catch (error) {
    logger.error(JSON.stringify(error));

    return res
      .status(401)
      .json(
        makeHttpError({ message: 'Invalid token', statusCode: res.statusCode })
      );
  }

  next();
}
