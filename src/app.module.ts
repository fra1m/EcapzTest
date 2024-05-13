import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from '@modules/transactions/transactions.module';
import { InvoicesModule } from '@modules/invoices/invoices.module';
import { CallbackModule } from '@modules/callbacks/callbacks.module';
import { P2P_TransactionsModule } from '@modules/p2p_transactions/p2p_transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    CallbackModule,
    TransactionModule,
    InvoicesModule,
    P2P_TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
