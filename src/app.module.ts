import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './config/db.module';
import { EnvModule } from './config/env.module';
import { OrdersModule } from './webhooks/orders/orders.module';
import { StockModule } from './modules/stock/stock.module';
import { EventModule } from './config/event.module';

@Module({
  imports: [EnvModule, DbModule, OrdersModule, StockModule, EventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
