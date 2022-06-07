import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from '../users/model/Users.model';
import { FileService } from '../file/file.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Users) private userRepository: typeof Users, private filesService: FileService, private usersService: UsersService) {
  }

  async updateAvatar(avatar: any, req) {
    try {
      const avatarPath = await this.filesService.createFile(avatar, 'avatars');
      const user = await this.usersService.getUserByEmail(req.user.email);
      user.avatar = avatarPath;
      await user.save();
      return user.avatar;
    } catch (e) {
      throw new HttpException('Пользователь не найден', HttpStatus.UNAUTHORIZED);
    }
  }

  async updateBanner(banner: any, req) {
    try {
      const bannerPath = await this.filesService.createFile(banner, 'banners');
      const user = await this.usersService.getUserByEmail(req.user.email);
      user.banner = bannerPath;
      await user.save();
      return user.banner;
    } catch (e) {
      throw new HttpException(e, HttpStatus.UNAUTHORIZED);
    }
  }
}
