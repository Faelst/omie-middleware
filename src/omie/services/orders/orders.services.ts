import { Injectable } from '@nestjs/common';
import OmieApi from '../../lib/api';

@Injectable()
export class OrdersServices {
  async consultOrderByOrderCode(orderCode: number) {
    const response = await OmieApi.post('/produtos/pedido/', {
      call: 'ConsultarPedido',
      param: [
        {
          codigo_pedido: orderCode,
        },
      ],
    });

    return response.data?.pedido_venda_produto;
  }
}
