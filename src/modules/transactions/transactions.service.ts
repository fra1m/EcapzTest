import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';

import * as Interfaces from './interfaces/interfaces';

@Injectable()
export class TransactionService {
  constructor(private configService: ConfigService) {}

  #secret = this.configService.get('Secret');
  #project = this.configService.get('Project');
  #domein = this.configService.get('Domein');
  #email = this.configService.get('Email');
  #result_url = this.configService.get('URL');
  #name = this.configService.get('DnsName');

  // FIXME: Использовал приватную переменную для айди платежа, можно вообще было Redis использовать
  #payment_id = '';

  async getCardToken(project: string): Promise<any> {
    const data = {
      project: project,
      number: '4244491609788988',
      expiration_month: '12',
      expiration_year: '2026',
      security_code: '501',
    };

    const response = await axios({
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://${this.#domein}/dev/card/getToken`,
      headers: {},
      data: data,
    });

    return response.data;
  }

  async createSignature(request: any, keyHex: string) {
    const values = Object.values(request);
    const hmacData = values.sort().join('|');
    const hmacKey = Buffer.from(keyHex, 'hex');
    const hmacObj = crypto.createHmac('sha256', hmacKey);
    hmacObj.update(hmacData);
    return hmacObj.digest('hex');
  }

  async getACSUrl() {
    try {
      const card = await this.getCardToken(this.#project);

      const data: Interfaces.PaymentData = {
        project: this.#project,
        card_token: card.id,
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
        url: `https://${this.#domein}/dev/card/process`,
        headers: {},
        data: data,
      };

      const data$ = await axios(config)
        .then(async (data$) => {
          console.log(data$.data);
          return data$.data;
        })
        .catch(function (error) {
          console.log(error.response.data);
        });

      this.#payment_id = data$.payment_id;

      return data$.acs.url;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getStatusTransaction(paymentId?: string, secret?: string) {
    const payment_id = paymentId ?? this.#payment_id;

    console.log(payment_id);

    const data: Interfaces.TransactionStatusData = {
      payment_id,
      project: this.#project,
    };

    data.signature = await this.createSignature(data, secret);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://${this.#domein}/dev/transaction/status`,
      headers: {},
      data: data,
    };

    return await axios(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
  }

  async rufundTransaction(payment_id: string) {
    const data: Interfaces.RefundTransactionData = {
      payment_id,
      project: this.#project,
      result_url: this.#result_url,
    };

    data.signature = await this.createSignature(data, this.#secret);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://${this.#domein}/dev/transaction/refund`,
      headers: {},
      data: data,
    };

    return await axios(config)
      .then((data) => {
        return data.data;
      })
      .catch(function (error) {
        console.log(error.response);
        return error.message;
      });
  }

  async getRefundStatusTransaction(refund_id: string, secret?: string) {
    console.log(refund_id);

    const data: Interfaces.RefundTransactionStatusData = {
      refund_id,
      project: this.#project,
    };

    data.signature = await this.createSignature(data, secret);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://${this.#domein}/dev/transaction/refund/status`,
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
