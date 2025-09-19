import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateOrUpdateOrderUseCase } from './usecases/create-updated-order.uscase';
import { WebhookOrdersDto } from './dtos/webhook-orders.dto';

@Controller('webhooks/orders')
export class OrdersController {
  constructor(
    private readonly createOrUpdateOrderUseCase: CreateOrUpdateOrderUseCase,
  ) {}

  @Post('')
  @HttpCode(200)
  async omieWebhook(@Body() body: WebhookOrdersDto): Promise<boolean> {
    console.log('Recebido webhook de pedidos', body);
    return this.createOrUpdateOrderUseCase.execute(body);
  }
}
