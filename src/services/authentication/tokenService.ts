import jwt from 'jsonwebtoken';
import { authConfig } from './config';

export interface AuthPayload {
  username: string;
}

interface TokenService {
  signAccessToken(payload: AuthPayload): string;
  signRefreshToken(payload: AuthPayload): string;

  verifyAccessToken(token: string): AuthPayload | undefined;
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

  verifyAccessToken(token) {
    try {
      return jwt.verify(
        token,
        authConfig.accessTokenSecret,
      ) as AuthPayload;
    } catch (e: any) {
      return undefined;
    }
  },
};
