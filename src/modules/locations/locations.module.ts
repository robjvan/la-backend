import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { locationsProviders } from './locations.providers';
import { HttpModule } from '@nestjs/axios';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [HttpModule, LoggingModule],
  providers: [LocationsService, ...locationsProviders],
  exports: [LocationsService],
})
export class LocationsModule {}
