import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';

import * as Interfaces from './interfaces/interfaces';

@Injectable()
export class P2P_TransactionsService {
  constructor(private configService: ConfigService) {}

  #secret = this.configService.get('Secret');
  #project = this.configService.get('Project');
  #domein = this.configService.get('Domein');
  #email = this.configService.get('Email');
  #result_url = this.configService.get('URL');
  #name = this.configService.get('DnsName');

  // FIXME: Использовал приватную переменную для айди платежа, можно вообще было Redis использовать
  #p2p_id = '';

  async createSignature(request: any, keyHex: string) {
    const values = Object.values(request);
    const hmacData = values.sort().join('|');
    const hmacKey = Buffer.from(keyHex, 'hex');
    const hmacObj = crypto.createHmac('sha256', hmacKey);
    hmacObj.update(hmacData);
    return hmacObj.digest('hex');
  }

  async newP2P() {
    try {
      const data: Interfaces.P2PData = {
        project: this.#project,
        order_id: '1234123412356',
        price: '6.00',
        currency: 'USD',
        result_url: this.#result_url,
        redirect_url: this.#result_url,
      };

      data.signature = await this.createSignature(data, this.#secret);

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://${this.#domein}/dev/p2p/initiate`,
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

      this.#p2p_id = data$.p2p_id;

      return JSON.stringify(data$.form_url);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getStatusTransaction(paymentId?: string, secret?: string) {
    const p2p_id = paymentId ?? this.#p2p_id;

    console.log(p2p_id);

    const data: Interfaces.P2P_StatusData = {
      p2p_id,
      project: this.#project,
    };

    data.signature = await this.createSignature(data, secret);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://${this.#domein}/dev/p2p/transaction/status`,
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
}
