import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { makeHttpError } from '../utils/response-api';

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
    return res
      .status(403)
      .json(makeHttpError({ message: 'No token provided' }));
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
  } catch (_error) {
    return res.status(401).json(makeHttpError({ message: 'Invalid token' }));
  }

  next();
}
