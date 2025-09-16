import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ValidateOrderStockUseCase } from './usecases/validate-order-stock.usecase';

@Injectable()
export class StockWorker {
  constructor(
    private readonly validateOrderStockUseCase: ValidateOrderStockUseCase,
  ) {}

  @OnEvent('order.updated')
  async handleOrderCreatedEvent(payload: any) {
    await this.validateOrderStockUseCase.execute(payload);
  }
}
