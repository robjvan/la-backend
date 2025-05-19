import { Controller, Get, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly metricsService: MetricsService,
  ) {}

  @Get('login-records')
  @ApiOperation({ summary: 'Fetch user login records' })
  public getAllLoginRecords() {
    return this.adminService.getAllLoginRecords();
  }

  @Get('login-records/:id')
  @ApiOperation({ summary: 'Fetch user login records by user ID' })
  public getAllLoginRecordsByUserId(@Param('id') id: number) {
    return this.adminService.getAllLoginRecordsByUserId(id);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Retrieve platform metrics' })
  public getMetrics() {
    return this.metricsService.getMetrics();
  }
}
