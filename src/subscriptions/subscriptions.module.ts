import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from '../users/model/Users.model';
import { JwtModule } from '@nestjs/jwt';
import { Subscriptions } from './model/Subscriptions.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Users, Subscriptions]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET_DEV',
      signOptions: {
        expiresIn: '72h'
      }
    })],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [
    SubscriptionsService
  ]
})
export class SubscriptionsModule {
}
