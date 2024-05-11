import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface PaymentData {
  project: any;
  card_token: string;
  user_contact_email: any;
  user_name: any;
  description: string;
  price: string;
  currency: string;
  order_id: string;
  user_phone: string;
  result_url: any;
  success_url: any;
  failure_url: any;
  ip: string;
  signature?: string;
}

interface TransactionData {
  project: string;
  payment_id: string;
  signature?: string;
}

@Injectable()
export class AppService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

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

      const data: PaymentData = {
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
        success_url: this.#result_url,
        failure_url: this.#result_url,
      };

      data.signature = await this.createSignature(data, this.#secret);
      console.log(data);

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://${this.#domein}/dev/card/process`,
        headers: {},
        data: data,
      };

      const payment_id = await axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          return response.data.payment_id;
        })
        .catch(function (error) {
          console.log(error.response.data);
        });

      this.#payment_id = payment_id;

      return payment_id;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getStatusTransaction() {
    const payment_id = this.#payment_id;

    console.log(payment_id);

    const data: TransactionData = {
      payment_id,
      project: this.#project,
    };

    data.signature = await this.createSignature(data, this.#secret);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://${this.#domein}/dev/transaction/status`,
      headers: {},
      data: data,
    };

    return await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        return response.data;
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
  }
}
