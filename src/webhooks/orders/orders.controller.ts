import { Body, Controller, Post } from '@nestjs/common';
// import { WebhookOrdersDto } from './dtos/webhook-orders.dto';
import { CreateOrUpdateOrderUseCase } from './usecases/create-updated-order.uscase';

@Controller('webhooks/orders')
export class OrdersController {
  constructor(
    private readonly createOrUpdateOrderUseCase: CreateOrUpdateOrderUseCase,
  ) {}

  @Post('')
  async omieWebhook(@Body() body: any): Promise<boolean> {
    return this.createOrUpdateOrderUseCase.execute(body);
  }
}
