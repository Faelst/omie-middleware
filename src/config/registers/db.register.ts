import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  client: process.env.DB_CLIENT ?? 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  user: process.env.DB_USER,
  pass: process.env.DB_PASS ?? '',
  name: process.env.DB_NAME,
  url: process.env.DATABASE_URL,
}));
