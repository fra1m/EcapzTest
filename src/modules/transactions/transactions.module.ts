import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransactionService } from './transactions.service';
import { TransactionController } from './transactions.controller';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
