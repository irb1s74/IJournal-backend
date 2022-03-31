import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { UserCreateDto } from 'src/users/dto/UserCreate.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,
              private jwtService: JwtService) {
  }

  async reg(dto: UserCreateDto) {
    const candidate = await this.usersService.userExists({ email: dto.email, nickname: dto.nickname });
    if (candidate) {
      throw new HttpException('Пользователь с таким email или ником существует', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.usersService.userCreate({ ...dto, password: hashPassword });
    return this.generateToken(user);
  }

  private async generateToken({ email, id, avatar, banner, banned }) {
    return {
      token: this.jwtService.sign({ email, id }),
      email,
      avatar,
      banner,
      banned
    };
  }

  //
  // private async validateUser(userDto: LoginUserDto) {
  //   const user = await this.usersService.getUserByEmail(userDto.email);
  //   if (!user) throw new UnauthorizedException({ message: 'Некорректный email или пароль' });
  //   const passwordEquals = await bcrypt.compare(userDto.password, user.password);
  //   if (passwordEquals) return await this.usersService.getUserById(user.id);
  //   throw new UnauthorizedException({ message: 'Некорректный email или пароль' });
  // }
}
