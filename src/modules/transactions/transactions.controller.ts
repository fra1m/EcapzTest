import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionService } from './transactions.service';

@Controller('transactions')
export class TransactionController {
  constructor(
    private transactionService: TransactionService,
    private configService: ConfigService,
  ) {}

  #secret = this.configService.get('Secret');

  @Post('/token')
  getACSUrl() {
    return this.transactionService.getACSUrl();
  }

  @Post('/status')
  transection() {
    return this.transactionService.getStatusTransaction();
  }

  @Post('/refund')
  refundTransaction(@Body() payment_id: any) {
    return this.transactionService.rufundTransaction(payment_id.payment_id);
  }
}
