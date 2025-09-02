import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { CreateOrUpdateOrderUseCase } from './usecases/create-updated-order.uscase';
import { OmieModule } from '../../omie/omie.module';

@Module({
  imports: [OmieModule],
  controllers: [OrdersController],
  providers: [CreateOrUpdateOrderUseCase],
})
export class OrdersModule {}
