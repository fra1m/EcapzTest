import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';

import * as Interfaces from './interfaces/interfaces';

@Injectable()
export class InvoicesService {
  constructor(private configService: ConfigService) {}

  #secret = this.configService.get('Secret');
  #project = this.configService.get('Project');
  #domein = this.configService.get('Domein');
  #email = this.configService.get('Email');
  #result_url = this.configService.get('URL');
  #name = this.configService.get('DnsName');

  // FIXME: Использовал приватную переменную для айди платежа, можно вообще было Redis использовать
  #invoice_id = '';

  async createSignature(request: any, keyHex: string) {
    const values = Object.values(request);
    const hmacData = values.sort().join('|');
    const hmacKey = Buffer.from(keyHex, 'hex');
    const hmacObj = crypto.createHmac('sha256', hmacKey);
    hmacObj.update(hmacData);
    return hmacObj.digest('hex');
  }

  async newInvoice() {
    try {
      const data: Interfaces.InvoiceData = {
        project: this.#project,
        order_id: '1234123412356',
        price: '6.00',
        currency: 'USD',
        description: 'live test payment',
        user_name: this.#name,
        user_phone: '5555555555',
        user_contact_email: this.#email,
        ip: '1.1.1.1',
        result_url: this.#result_url,
        success_url: `https://example.com/success`,
        failure_url: this.#result_url,
      };

      data.signature = await this.createSignature(data, this.#secret);

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://${this.#domein}/dev/invoices`,
        headers: {},
        data: data,
      };

      const data$ = await axios(config)
        .then(async (data$) => {
          console.log(data$.data.payment_url);
          return data$.data.invoice_id;
        })
        .catch(function (error) {
          console.log(error.response.data);
        });

      this.#invoice_id = data$.invoice_id;

      return data$;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getStatusInvoice(invoice_id: string, secret?: string) {
    console.log(invoice_id);

    const data: Interfaces.InvoiceStatusData = {
      invoice_id,
      project: this.#project,
    };

    data.signature = await this.createSignature(data, secret);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://${this.#domein}/dev/invoices/status`,
      headers: {},
      data: data,
    };

    return await axios(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
