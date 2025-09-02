import { Injectable } from '@nestjs/common';
import OmieApi from '../../lib/api';

@Injectable()
export class CategoriesServices {
  async getByCode(categoryCode: string) {
    const response = await OmieApi.post('/geral/categorias/', {
      call: 'ConsultarCategoria',
      param: [
        {
          codigo: categoryCode,
        },
      ],
    });

    return response.data;
  }
}
