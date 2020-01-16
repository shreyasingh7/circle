import { Get, Controller, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Render('index')
  @Get()
  render() {
    const message = this.appService.getHello();
    return { message };
  }
}
