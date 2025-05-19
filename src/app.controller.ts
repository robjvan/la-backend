import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { AppService } from './app.service';

@Controller()
@ApiTags('App')
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Checks for live connection to server' })
  @ApiResponse({
    description: 'Successfully pinged the server',
    status: 200,
    example: 'pong',
  })
  ping(): string {
    return 'pong';
  }
}
