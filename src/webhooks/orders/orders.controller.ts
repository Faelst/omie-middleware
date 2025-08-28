import { Body, Controller, Post } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { WebhookOrdersDto } from './dtos/webhook-orders.dto';

@Controller('webhooks/orders')
export class OrdersController {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  @Post('')
  async omieWebhook(@Body() body: WebhookOrdersDto): Promise<boolean> {
    const { event } = body;

    const sale = await this.knex
      .table('omie_orders')
      .where({ omie_codigo_pedido: Number(event.idPedido) })
      .first();

    if (!sale) {
      return false;
    }

    return true;
  }
}
