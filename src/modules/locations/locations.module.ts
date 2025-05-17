import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { locationsProviders } from './locations.providers';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [LocationsService, ...locationsProviders],
  exports: [LocationsService],
})
export class LocationsModule {}
