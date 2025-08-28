import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';

@Module({
  imports: [
    KnexModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        config: {
          client: cfg.get<string>('db.client', 'mysql'),
          version: '5.7',
          connection: {
            host: cfg.get<string>('db.host', 'localhost'),
            user: cfg.get<string>('db.user', 'root'),
            password: cfg.get<string>('db.pass', ''),
            database: cfg.get<string>('db.name', 'test'),
          },
        },
      }),
    }),
  ],
})
export class DbModule {}
