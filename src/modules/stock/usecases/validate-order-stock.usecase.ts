import { Injectable, Logger } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ValidateOrderStockUseCase {
  private readonly logger = new Logger(ValidateOrderStockUseCase.name);

  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(payload: any): Promise<void> {
    const order = await this.knex('omie_orders')
      .where({ omie_codigo_pedido: payload.orderId })
      .first();

    if (!order) {
      this.logger.warn(`Pedido com id ${payload.orderId} não encontrado`);
      return;
    }

    if (order.pedido_separado === 's' || order.status_etapa !== '10') {
      this.logger.log(
        `Pedido ${payload.orderId} já está marcado como separado`,
      );

      return;
    }

    const items = await this.knex('omie_order_items').where({
      order_id: payload.orderId,
    });

    this.logger.log(
      `Validando estoque para pedido ${payload.orderId} com ${items.length} itens`,
    );

    if (!items.length) {
      this.logger.warn(`Pedido ${payload.orderId} não possui itens`);

      return;
    }

    for (const item of items) {
      const product = await this.knex('estoque_locais_sku')
        .where({ sku: item.sku })
        .first();

      if (!product) {
        this.logger.warn(`Produto SKU ${item.sku} não encontrado no estoque`);
        return;
      }

      if (product.saldo < item.quantidade) {
        this.logger.warn(
          `Estoque insuficiente para SKU ${item.sku}. Necessário: ${item.quantidade}, Disponível: ${product.saldo}`,
        );

        await this.knex('omie_orders')
          .where({ omie_codigo_pedido: payload.orderId })
          .update({ pedido_separado: 'n', status_etapa: '10' });

        return;
      }

      await this.knex('estoque_locais_sku')
        .where({ sku: item.sku })
        .update({
          reservado: this.knex.raw('reservado + ?', [item.quantidade]),
          saldo: this.knex.raw('saldo - ?', [item.quantidade]),
        });
    }

    this.logger.log(
      `Estoque validado com sucesso para pedido ${payload.orderId}`,
    );

    await this.knex('omie_orders')
      .where({ omie_codigo_pedido: payload.orderId })
      .update({ pedido_separado: 's', status_etapa: '20' });
  }
}
