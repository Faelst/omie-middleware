import { Module } from '@nestjs/common';
import { OmieServices } from './omie.services';
import { VendorsServices } from './services/vendors/vendors.services';
import { OrdersServices } from './services/orders/orders.services';
import { CategoriesServices } from './services/categories/categories.services';
import { ClientsServices } from './services/clients/clients.services';

@Module({
  providers: [
    OmieServices,
    VendorsServices,
    OrdersServices,
    ClientsServices,
    CategoriesServices,
  ],
  exports: [OmieServices],
})
export class OmieModule {}
