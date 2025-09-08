import { SignOptions } from 'jsonwebtoken';

function loadAuthConfig() {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('Access Token Secret not configured');
  }
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('Refresh Token Secret not configured');
  }

  return {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    accessTokenExpiresIn: '10m' as SignOptions['expiresIn'],
    refreshTokenExpiresIn: '1d' as SignOptions['expiresIn'],
  };
}

export const authConfig = loadAuthConfig();
