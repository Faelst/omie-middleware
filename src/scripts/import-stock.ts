import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { SyncStockFromOmieUseCase } from '../modules/stock/usecases/sync-stock-from-omie.usecase';

async function bootstrap() {
  const logger = new Logger('ImportEstoqueScript');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  try {
    const useCase = app.get(SyncStockFromOmieUseCase);

    logger.log(
      'Iniciando importação de estoque via SyncStockFromOmieUseCase.execute()',
    );

    await useCase.execute();

    logger.log('Importação finalizada com sucesso.');
  } catch (err) {
    logger.error('Falha ao executar importação de estoque', err as any);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
  process.exitCode = 1;
});

bootstrap();
