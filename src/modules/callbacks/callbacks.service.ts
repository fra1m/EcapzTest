import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';
import { TransactionService } from '@modules/transactions/transactions.service';
import { InvoicesService } from '@modules/invoices/invoices.service';

@Injectable()
export class CallbackService {
  constructor(
    private configService: ConfigService,
    private transactionService: TransactionService,
    private invoicesService: InvoicesService,
  ) {}

  #secret = this.configService.get('Secret');
  #project = this.configService.get('Project');
  #domein = this.configService.get('Domein');
  #email = this.configService.get('Email');
  #result_url = this.configService.get('URL');
  #name = this.configService.get('DnsName');

  async callBack(cb: any) {
    let status;
    console.log('cb data', cb);
    const { signature, ...data } = cb;
    Object.keys(data).forEach((key) => {
      if (
        data[key] === null ||
        (Array.isArray(data[key]) && data[key].length === 0)
      ) {
        delete data[key];
      }
      // if (typeof data[key] === 'boolean') {
      //   data[key] = data[key].toString();
      // }
    });
    const signature$ = await this.transactionService.createSignature(
      data,
      this.#secret,
    );

    if (signature$ !== signature) {
      throw new HttpException(
        'Bad signature',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    switch (true) {
      case !!data.payment_id:
        status = await this.transactionService.getStatusTransaction(
          data.payment_id,
          this.#secret,
        );
        break;
      case !!data.refund_id:
        status = await this.transactionService.getRefundStatusTransaction(
          data.refund_id,
          this.#secret,
        );
        break;
      case !!data.invoice_id:
        status = await this.invoicesService.getStatusInvoice(
          data.invoice_id,
          this.#secret,
        );
        break;
      case !!data.p2p_id:
        status = await this.invoicesService.getStatusInvoice(
          data.p2p_id,
          this.#secret,
        );
        break;
      default:
        throw new HttpException('Bad body', HttpStatus.BAD_REQUEST);
    }

    return status;
  }
}
