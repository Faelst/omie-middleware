import { Injectable } from '@nestjs/common';
import { VendorsServices } from './services/vendors/vendors.services';
import { OrdersServices } from './services/orders/orders.services';
import { ClientsServices } from './services/clients/clients.services';
import { CategoriesServices } from './services/categories/categories.services';
import { StockServices } from './services/stock/stock.services';

@Injectable()
export class OmieServices {
  constructor(
    private readonly vendorsServices: VendorsServices,
    private readonly ordersServices: OrdersServices,
    private readonly clientsServices: ClientsServices,
    private readonly categoriesServices: CategoriesServices,
    private readonly stockServices: StockServices,
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

  get stock() {
    return this.stockServices;
  }
}
