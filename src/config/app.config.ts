import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT) || 6000,
  NODE_ENV: process.env.NODE_ENV,
  APP_VERSION: process.env.APP_VERSION,
  log_level: process.env.LOG_LEVEL,
  admin_jwt_secret: process.env.ADMIN_JWT_SECRET,
  client_jwt_secret: process.env.CLIENT_JWT_SECRET,
  employee_jwt_secret: process.env.EMPLOYEE_JWT_SECRET,
}));
