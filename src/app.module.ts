import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './config/db.module';
import { EnvModule } from './config/env.module';
import { OrdersModule } from './webhooks/orders/orders.module';

@Module({
  imports: [EnvModule, DbModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
