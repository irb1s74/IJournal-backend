import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserCreateDto } from 'src/users/dto/UserCreate.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('/reg')
  @UsePipes(ValidationPipe)
  reg(@Body() dto: UserCreateDto) {
    return this.authService.reg(dto);
  }
}
