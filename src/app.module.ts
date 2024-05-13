import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from '@modules/transactions/transactions.module';
import { InvoicesModule } from '@modules/invoices/invoices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    TransactionModule,
    InvoicesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
