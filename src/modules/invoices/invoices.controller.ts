import { Controller, Get, Post } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('/new')
  getACSUrl() {
    return this.invoicesService.newInvoice();
  }

  @Get('/wtf')
  wtf() {
    return { status: 200 };
  }
}
