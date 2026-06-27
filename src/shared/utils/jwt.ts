import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.TOKEN_SYMMETRIC_KEY || 'default_secret';

export const generateToken = (userId: number, email: string): string => {
  return jwt.sign({ user_id: userId, email }, SECRET_KEY, {
    expiresIn: '24h',
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, SECRET_KEY);
};
