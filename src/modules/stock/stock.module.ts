import { Module } from '@nestjs/common';
import { SyncStockFromOmieUseCase } from './usecases/sync-stock-from-omie.usecase';
import { OmieModule } from '../../omie/omie.module';
import { ValidateOrderStockUseCase } from './usecases/validate-order-stock.usecase';
import { StockWorker } from './stock.woker';

@Module({
  imports: [OmieModule],
  providers: [SyncStockFromOmieUseCase, ValidateOrderStockUseCase, StockWorker],
  exports: [SyncStockFromOmieUseCase, StockWorker],
})
export class StockModule {}
