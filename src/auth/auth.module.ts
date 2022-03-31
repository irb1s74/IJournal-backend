import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[
    UsersModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || "SECRET_DEV",
      signOptions: {
        expiresIn: "12h"
      }
    })
  ]
})
export class AuthModule {}
