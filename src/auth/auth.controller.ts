import {
  Body,
  Controller, Get,
  Post, Req, UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { UserCreateDto } from 'src/users/dto/UserCreate.dto';
import { UserLoginDto } from 'src/users/dto/UserLogin.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('/login')
  @UsePipes(ValidationPipe)
  login(@Body() dto: UserLoginDto) {
    return this.authService.login(dto);
  }

  @Post('/reg')
  @UsePipes(ValidationPipe)
  reg(@Body() dto: UserCreateDto) {
    return this.authService.reg(dto);
  }

  @Get('/ref')
  @UseGuards(JwtAuthGuard)
  ref(@Req() request: Request) {
    return this.authService.ref(request);
  }
}
