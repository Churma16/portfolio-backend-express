import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const getSecretKey = (): string => {
  const secretKey = process.env.TOKEN_SYMMETRIC_KEY;
  if (!secretKey || secretKey.trim().length === 0) {
    throw new Error('TOKEN_SYMMETRIC_KEY environment variable is required and must not be empty');
  }
  return secretKey;
};

export const generateToken = (userId: number, email: string): string => {
  return jwt.sign({ user_id: userId, email }, getSecretKey(), {
    algorithm: 'HS256',
    expiresIn: '24h',
  });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, getSecretKey(), {
    algorithms: ['HS256'],
  });
};
