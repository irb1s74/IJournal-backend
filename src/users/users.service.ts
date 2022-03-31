import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserCreateDto } from './dto/UserCreate.dto';
import { UserExistsDto } from './dto/UserExists.dto';
import { Users } from './model/Users.model';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users) private userRepository: typeof Users) {
  }

  async userCreate(dto: UserCreateDto) {
    return await this.userRepository.create(dto);
  }

  async userExists({ email, nickname }: UserExistsDto) {
    return await this.userRepository.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { nickname: nickname }
        ]
      }
    });
  }

}
