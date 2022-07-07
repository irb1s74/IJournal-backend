import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { FileModule } from '../file/file.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from '../users/model/Users.model';
import { Post } from '../post/model/Post.model';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    SequelizeModule.forFeature([Users, Post]),
    UsersModule,
    FileModule,
    SubscriptionsModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET_DEV',
      signOptions: {
        expiresIn: '12h'
      }
    })
  ]
})
export class ProfileModule {
}
