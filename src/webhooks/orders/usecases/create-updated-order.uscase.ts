import { Injectable, Logger } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { ETAPA_DESCR_MAP } from '../../../omie/constants/steps.constants';
import { toNumberOrNull } from '../../../utils/to-number-or-null';
import { WebhookOrdersDto } from '../dtos/webhook-orders.dto';
import { parseBrDateToUTC } from '../../../utils/parse-br-date-to-utc.utils';
import { OmieServices } from '../../../omie/omie.services';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CreateOrUpdateOrderUseCase {
  private readonly logger = new Logger(CreateOrUpdateOrderUseCase.name);

  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly omieServices: OmieServices,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(dto: WebhookOrdersDto): Promise<boolean> {
    const { event } = dto;

    this.logger.log(
      `payload recebido para processamento do webhook: ${JSON.stringify(dto)}`,
    );

    if (!event?.idPedido) {
      this.logger.warn(`Webhook sem idPedido: ${JSON.stringify(event)}`);
      return true;
    }

    const omieCodigoPedido = toNumberOrNull(event?.idPedido);

    if (!omieCodigoPedido) {
      this.logger.warn(`Webhook sem idPedido válido: ${event?.idPedido}`);
      return false;
    }

    const etapa = toNumberOrNull(event.etapa) ?? null;
    const etapaDescr =
      event.etapaDescr?.toString().trim() ||
      ETAPA_DESCR_MAP[event.etapa] ||
      null;
    const clientId = toNumberOrNull(event.idCliente);
    const dataPrevisao = parseBrDateToUTC(event.dataPrevisao as any);
    const numeroPedido = event.numeroPedido?.toString() ?? null;
    const categoriaCod = event.codigoCategoria?.toString() ?? null;

    const [order, client, category] = await Promise.all([
      this.omieServices.orders.consultOrderByOrderCode(omieCodigoPedido),
      this.omieServices.clients.getById(clientId),
      this.omieServices.categories.getByCode(categoriaCod),
    ]).catch((err) => {
      this.logger.error(
        `Erro ao consultar dados do pedido/categoria/cliente omie_codigo_pedido=${omieCodigoPedido}, cliente_cod=${clientId}, categoria_cod=${categoriaCod} - ${err.message}`,
        err.stack,
      );
      return [null, null, null];
    });

    if (!order) {
      this.logger.warn(
        `Pedido não encontrado na Omie omie_codigo_pedido=${omieCodigoPedido}`,
      );
      return false;
    }

    const origemPedido = order?.cabecalho?.origem_pedido ?? null;

    const vendedorCod = toNumberOrNull(
      order?.informacoes_adicionais?.codVend ?? null,
    );
    const transportadoraCod = toNumberOrNull(
      order?.frete?.codigo_transportadora ?? null,
    );
    const observacoes = order?.observacoes?.obs_venda ?? null;
    const categoriaNome = category?.descricao ?? null;
    const clienteNome = client?.razao_social ?? null;
    const vendedor = vendedorCod
      ? await this.omieServices.vendors.getById(vendedorCod)
      : null;
    const deliverer = transportadoraCod
      ? await this.omieServices.clients.getById(transportadoraCod)
      : null;
    const now = new Date();

    await this.knex.transaction(async (trx) => {
      const existing = await trx('omie_orders')
        .where({ omie_codigo_pedido: omieCodigoPedido })
        .first();

      const payloadToPersist = {
        omie_codigo_pedido: omieCodigoPedido,
        omie_numero_pedido: null as unknown as string | null,
        omie_codigo_pedido_integracao: null as unknown as string | null,
        numero_pedido: numeroPedido,
        empresa_cod: null as unknown as number | null,
        cliente_cod: clientId,
        cliente_nome: clienteNome,
        status_etapa: etapa,
        categoria_cod: categoriaCod,
        vendedor_cod: vendedorCod,
        transportadora_cod: transportadoraCod,
        origem_pedido: origemPedido,
        data_emissao: now,
        data_previsao: dataPrevisao,
        data_entrega: null as unknown as Date | null,
        total_valor: null as unknown as number | null,
        total_descontos: null as unknown as number | null,
        frete_valor: null as unknown as number | null,
        observacoes: observacoes,
        raw: null as unknown as any,
        categoria_nome: categoriaNome,
        vendedor_nome: vendedor?.nome || null,
        transportadora_nome: deliverer?.razao_social || null,
        etapa_descricao: etapaDescr,
        updated_at: now,
      };

      if (!existing) {
        await trx('omie_orders').insert({
          ...payloadToPersist,
          created_at: now,
        });

        this.logger.log(`Criado pedido omie_codigo_pedido=${omieCodigoPedido}`);
      } else {
        await trx('omie_orders')
          .where({ omie_codigo_pedido: omieCodigoPedido })
          .update(payloadToPersist);

        this.logger.log(
          `Atualizado pedido omie_codigo_pedido=${omieCodigoPedido}`,
        );
      }

      this.logger.log(
        `Finalizado processamento do webhook para idPedido=${event?.idPedido}`,
      );

      await trx('omie_order_items')
        .where({ order_id: order.cabecalho.codigo_pedido })
        .delete();

      for (const item of order?.det || []) {
        await trx('omie_order_items').insert({
          order_id: order.cabecalho.codigo_pedido,
          omie_codigo_item: item.ide.codigo_item,
          sku: item.produto.codigo,
          descricao: item.produto.descricao,
          ncm: item.produto.ncm,
          ean: item.produto.ean,
          cfop: item.produto.cfop,
          unidade: item.produto.unidade,
          localizacao: item.inf_adic.codigo_local_estoque,
          categoria_item_cod: item.inf_adic.codigo_categoria_item,
          quantidade: item.produto.quantidade,
          valor_unitario: item.produto.valor_unitario,
          valor_total: item.produto.valor_total,
          desconto_percent: item.produto.percentual_desconto,
        });
      }
    });

    this.eventEmitter.emit('order.updated', {
      orderId: order.cabecalho.codigo_pedido,
    });

    return true;
  }
}
