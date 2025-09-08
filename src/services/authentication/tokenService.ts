import jwt from 'jsonwebtoken';
import { authConfig } from './config';

interface AuthPayload {
  username: string;
}

export interface TokenService {
  signAccessToken(payload: AuthPayload): string;
  signRefreshToken(payload: AuthPayload): string;
}

export const tokenService: TokenService = {
  signAccessToken(payload) {
    return jwt.sign(payload, authConfig.accessTokenSecret, {
      expiresIn: authConfig.accessTokenExpiresIn,
    });
  },
  signRefreshToken(payload) {
    return jwt.sign(payload, authConfig.refreshTokenSecret, {
      expiresIn: authConfig.refreshTokenExpiresIn,
    });
  },
};
