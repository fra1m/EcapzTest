import { Module } from '@nestjs/common';
import { CallbackController } from './callbacks.controller';
import { CallbackService } from './callbacks.service';
import { InvoicesModule } from '@modules/invoices/invoices.module';
import { TransactionModule } from '@modules/transactions/transactions.module';

@Module({
  imports: [InvoicesModule, TransactionModule],
  controllers: [CallbackController],
  providers: [CallbackService],
})
export class CallbackModule {}
