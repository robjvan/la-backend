import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { subscriptionsProviders } from './subscriptions.providers';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, ...subscriptionsProviders],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
