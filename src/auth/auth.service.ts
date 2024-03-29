import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserCreateDto } from 'src/users/dto/UserCreate.dto';
import { UserLoginDto } from 'src/users/dto/UserLogin.dto';
import * as bcrypt from 'bcryptjs';

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

  async login(userDto: UserLoginDto) {
    const user = await this.validate(userDto);
    return this.generateToken(user);
  }

  async ref(request) {
    const user = await this.usersService.getUserByEmail(request.user.email);
    return this.generateToken(user);
  }

  private async generateToken({ email, id, nickname, avatar, banner, banned, banReason, aboutUser }) {
    return {
      email, id, nickname, avatar, banner, banned, banReason, aboutUser,
      token: this.jwtService.sign({ email, id })
    };
  }

  private async validate({ email, password }: UserLoginDto) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) throw new UnauthorizedException({ message: 'Некорректный email или пароль' });
    const passwordEquals = await bcrypt.compare(password, user.password);
    if (passwordEquals) return user;
    throw new UnauthorizedException({ message: 'Некорректный email или пароль' });
  }
}
