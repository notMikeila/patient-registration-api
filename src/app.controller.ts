import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  health() {
    return {status: 200, message: 'OK'}
  }

  @Get('health')
  healthCheck() {
    return {status: 200, message: 'OK'}
  }
}
