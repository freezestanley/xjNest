import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ab*cd')
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('ff')
  getFFmpeg(): string {
    return this.appService.getFFmpeg();
  }

  @Get('shot')
  async getShot(): Promise<string> {
    return await this.appService.getPuppeteer();
  }
  @Get('avi')
  async getAvi(): Promise<string> {
    return await this.appService.getAvi();
  }
  @Get('mp4')
  async getMp4(): Promise<string> {
    return await this.appService.getMp4();
  }
}
