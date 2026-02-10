import { config } from './config';
import { ServerError } from './errors';

type ConfigType = typeof config;
export const validateConfig = (config: ConfigType) => {};
