import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { P2P_TransactionsService } from './p2p_transactions.service';

@Controller('p2p')
export class P2P_TransactionsController {
  constructor(
    private readonly p2PTransactionsService: P2P_TransactionsService,
  ) {}

  @Post('new')
  newP2P() {
    return this.p2PTransactionsService.newP2P();
  }
}
