import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from '@modules/transactions/transactions.module';
import { InvoicesModule } from '@modules/invoices/invoices.module';
import { CallbackModule } from '@modules/callbacks/callbacks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    TransactionModule,
    InvoicesModule,
    CallbackModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
