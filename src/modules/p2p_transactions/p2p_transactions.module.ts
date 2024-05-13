import { Module } from '@nestjs/common';
import { P2P_TransactionsService } from './p2p_transactions.service';
import { P2P_TransactionsController } from './p2p_transactions.controller';
import { CallbackModule } from '@modules/callbacks/callbacks.module';

@Module({
  imports: [CallbackModule],
  controllers: [P2P_TransactionsController],
  providers: [P2P_TransactionsService],
})
export class P2P_TransactionsModule {}
