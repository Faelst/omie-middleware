import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import appRegister from './registers/app.register';
import dbRegister from './registers/db.register';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),
        PORT: Joi.number().default(3000),
        DB_CLIENT: Joi.string().valid('mysql').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().allow(''),
        DB_NAME: Joi.string().required(),
        // DATABASE_URL: Joi.string().uri().optional(),
        LOG_LEVEL: Joi.string().default('info'),
        ENABLE_CORS: Joi.boolean()
          .truthy('true', '1')
          .falsy('false', '0')
          .default(true),
      }),
      load: [appRegister, dbRegister],
    }),
  ],
})
export class EnvModule {}
