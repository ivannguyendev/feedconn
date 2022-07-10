import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.APP_PORT || 3000,
  env: process.env.NODE_ENV,
  base: process.env.APP_BASE || '',
  showErrorStack: process.env.SHOW_ERROR_STACK,
}));
