import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { subscriptionsProviders } from './subscriptions.providers';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [LoggingModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, ...subscriptionsProviders],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
