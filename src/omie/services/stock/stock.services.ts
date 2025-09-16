import { Injectable } from '@nestjs/common';
import OmieApi from '../../lib/api';

@Injectable()
export class StockServices {
  async fetchAllProducts({ page, perPage }: { page: number; perPage: number }) {
    const response = await OmieApi.post('/estoque/consulta/', {
      call: 'ListarPosEstoque',
      param: [
        {
          nPagina: page,
          nRegPorPagina: perPage,
          codigo_local_estoque: 0,
          lista_local_estoque: '',
        },
      ],
    });

    return response.data;
  }
}
