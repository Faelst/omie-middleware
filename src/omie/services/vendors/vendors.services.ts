import { Injectable } from '@nestjs/common';
import OmieApi from '../../lib/api';

@Injectable()
export class VendorsServices {
  async getById(vendorCode: string | number) {
    const response = await OmieApi.post('/geral/vendedores/', {
      call: 'ConsultarVendedor',
      param: [
        {
          codigo: vendorCode,
        },
      ],
    });

    return response.data;
  }
}
