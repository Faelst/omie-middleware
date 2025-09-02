import { Injectable } from '@nestjs/common';
import { VendorsServices } from './services/vendors/vendors.services';
import { OrdersServices } from './services/orders/orders.services';
import { ClientsServices } from './services/clients/clients.services';
import { CategoriesServices } from './services/categories/categories.services';

@Injectable()
export class OmieServices {
  constructor(
    private readonly vendorsServices: VendorsServices,
    private readonly ordersServices: OrdersServices,
    private readonly clientsServices: ClientsServices,
    private readonly categoriesServices: CategoriesServices,
  ) {}

  get vendors() {
    return this.vendorsServices;
  }

  get orders() {
    return this.ordersServices;
  }

  get clients() {
    return this.clientsServices;
  }

  get categories() {
    return this.categoriesServices;
  }
}
