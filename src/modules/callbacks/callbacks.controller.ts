import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { CallbackService } from './callbacks.service';

@Controller('cb')
export class CallbackController {
  constructor(private callbackService: CallbackService) {}

  @Post()
  async takeCb(@Body() cb: any, @Res() res: any) {
    try {
      console.log('cb data', cb);
      const status = await this.callbackService.callBack(cb);
      if (status) {
        return res.status(200).send({ message: 'Received' });
      }
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }
}
