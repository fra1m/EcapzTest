import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
