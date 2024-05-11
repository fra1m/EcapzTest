import {
  Body,
  Controller,
  Get,
  Head,
  HttpCode,
  HttpException,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  #secret = this.configService.get('Secret');

  @Post('/token')
  getACSUrl() {
    return this.appService.getACSUrl();
  }

  @Post('/status')
  transection() {
    return this.appService.getStatusTransaction();
  }

  @Post('/cb')
  @HttpCode(200)
  async takeCb(@Body() cb: any) {
    try {
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
      const signature$ = await this.appService.createSignature(
        data,
        this.#secret,
      );
      console.log(signature$ === signature);

      const status = await this.appService.getStatusTransaction(
        data.payment_id,
        this.#secret,
      );
      if (status) {
        return { message: 'Received' };
      } else {
        throw new Error('Status not found');
      }
    } catch (error) {
      console.error('Error handling callback:', error);
      throw new Error('Internal Server Error');
    }
  }
}
