import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/token')
  getACSUrl() {
    return this.appService.getACSUrl();
  }

  @Post('/status')
  transection() {
    return this.appService.getStatusTransaction();
  }
}
