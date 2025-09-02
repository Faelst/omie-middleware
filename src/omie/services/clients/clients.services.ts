import { Injectable } from '@nestjs/common';
import OmieApi from '../../lib/api';

@Injectable()
export class ClientsServices {
  async getById(clientCode: number) {
    const response = await OmieApi.post('/geral/clientes/', {
      call: 'ConsultarCliente',
      param: [
        {
          codigo_cliente_omie: Number(clientCode),
        },
      ],
    });

    return response.data;
  }
}
