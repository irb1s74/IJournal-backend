import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from '../users/model/Users.model';
import { FileService } from '../file/file.service';
import { UsersService } from '../users/users.service';
import { Op } from 'sequelize';
import { Post } from '../post/model/Post.model';
import { Subscriptions } from '../subscriptions/model/Subscriptions.model';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Users) private userRepository: typeof Users, @InjectModel(Post) private postsRepository: typeof Users, private filesService: FileService, private usersService: UsersService) {
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

  async getPostDrafts(req) {
    return this.postsRepository.findAll({
      where: {
        [Op.and]: [
          { publish: false },
          { userId: req.user.id }
        ]
      },
      attributes: { exclude: ['userId'] },
      include: {
        model: Users,
        attributes: [
          'id', 'nickname', 'email', 'avatar'
        ]
      }
    });
  }

  async getPostPublish(req) {
    return this.postsRepository.findAll({
      where: {
        [Op.and]: [
          { publish: true },
          { userId: req.user.id }
        ]
      },
      attributes: { exclude: ['userId'] },
      include: {
        model: Users,
        attributes: [
          'id', 'nickname', 'email', 'avatar'
        ]
      }
    });
  }

  async getUserPost(userId) {
    return this.postsRepository.findAll({
      where: {
        [Op.and]: [
          { publish: true },
          { userId: userId }
        ]
      },
      attributes: { exclude: ['userId'] },
      include: {
        model: Users,
        attributes: [
          'id', 'nickname', 'email', 'avatar'
        ]
      }
    });
  }

  async getUser(userId) {
    return await this.userRepository.findByPk(userId, {
      attributes: {
        exclude: ['password', 'id']
      },
      include: [
        {
          model: Post,
          include: [{
            model: Users,
            attributes: [
              'id', 'nickname', 'email', 'avatar'
            ]
          }]
        },
        {
          model: Subscriptions,
          as: 'subscriptions',
          where: {
            userId: {
              [Op.ne]: userId
            }
          },
          include: [{
            model: Users,
            attributes: [
              'id', 'nickname', 'email', 'avatar'
            ]
          }]
        }
      ]
    });
  }

}