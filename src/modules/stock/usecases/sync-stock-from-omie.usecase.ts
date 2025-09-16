import { Injectable, Logger } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import { OmieServices } from '../../../omie/omie.services';

@Injectable()
export class SyncStockFromOmieUseCase {
  private readonly logger = new Logger(SyncStockFromOmieUseCase.name);

  constructor(
    @InjectConnection() private readonly knex: Knex,
    private readonly omieServices: OmieServices,
  ) {}

  async execute(): Promise<void> {
    this.logger.log('Executando use case SyncStockFromOmieUseCase');

    let page = 1;
    let items;

    do {
      items = await this.omieServices.stock.fetchAllProducts({
        page: page,
        perPage: 1000,
      });

      for (const item of items?.produtos || []) {
        const [existing] = await this.knex('estoque_locais_sku')
          .where({ sku: item.cCodigo })
          .select('*')
          .limit(1);

        if (existing) {
          await this.knex('estoque_locais_sku')
            .update({
              sku: item.cCodigo,
              descricao_local: item.cDescricao,
              local_id: item.codigo_local_estoque,
              fisico: item?.fisico || 0,
              reservado: item?.reservado || 0,
              saldo: item?.nSaldo || 0,
              estoque_minimo: item?.estoque_minimo,
            })
            .where({ id: existing.id });
        } else {
          await this.knex('estoque_locais_sku').insert({
            sku: item.cCodigo,
            descricao_local: item.cDescricao,
            local_id: item.codigo_local_estoque,
            fisico: item?.fisico || 0,
            reservado: item?.reservado || 0,
            saldo: item?.nSaldo || 0,
            estoque_minimo: item?.estoque_minimo || 0,
          });
        }

        this.logger.log(
          `Produto ${item.cCodigo} - ${item.cCodigo} - ${item.cDescricao} sincronizado.`,
        );
      }

      this.logger.log(
        `Página ${page} processada com ${items?.produtos?.length || 0} itens.`,
      );

      page += 1;
    } while (items?.nTotPaginas >= page);

    this.logger.log(
      `Sincronização finalizada. itens processados ${items?.nTotRegistros || 0}`,
    );
  }
}
