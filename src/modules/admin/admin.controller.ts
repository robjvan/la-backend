import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('admin')
@ApiTags('Admin')
@UseGuards(AdminGuard)
@ApiBearerAuth('access-token')
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
