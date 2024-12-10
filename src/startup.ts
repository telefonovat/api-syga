import { config } from './config';
import { ServerError } from './errors';

type ConfigType = typeof config;
export const validateConfig = (config: ConfigType) => {
  if (!config.MONGODB_URL) {
    throw new ServerError(
      'MONGODB URL is not defined. Cannot connect to DB',
    );
  }

  if (!config.JWT_SECRET) {
    throw new ServerError(
      'JWT secret is undefined. Cannot produce tokens',
    );
  }
};
