import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from '../users/model/Users.model';
import { FileService } from '../file/file.service';
import { UsersService } from '../users/users.service';
import { QueryTypes } from 'sequelize';
import { Post } from '../post/model/Post.model';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Users) private userRepository: typeof Users, @InjectModel(Post) private postsRepository: typeof Users, private filesService: FileService, private usersService: UsersService, private subscriptionsService: SubscriptionsService) {
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

  async getPostDrafts(userId) {
    return this.postsRepository.sequelize.query(`(SELECT 
    post."id", post."userId", post."title", post."data", post."publish", post."updatedAt", 
    (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'up' AND post."id" = rating."postId") - (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'down' AND post."id" = rating."postId") as "rating",
    author."id" AS "author.id", author."email" AS "author.email", author."nickname" AS "author.nickname", author."avatar" AS "author.avatar"
    FROM ((post
    LEFT OUTER JOIN users AS author ON post."userId" = "author"."id")
    LEFT OUTER JOIN rating ON post."id" = rating."postId"
    )  WHERE post."publish" = false AND post."userId" = ${userId})`,
      {
        nest: true,
        type: QueryTypes.SELECT
      });
  }

  async getPostPublish(userId) {
    return this.postsRepository.sequelize.query(`(SELECT 
    post."id", post."userId", post."title", post."data", post."publish", post."updatedAt", 
    (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'up' AND post."id" = rating."postId") - (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'down' AND post."id" = rating."postId") as "rating",
    author."id" AS "author.id", author."email" AS "author.email", author."nickname" AS "author.nickname", author."avatar" AS "author.avatar"
    FROM ((post
    LEFT OUTER JOIN users AS author ON post."userId" = "author"."id")
    LEFT OUTER JOIN rating ON post."id" = rating."postId"
    )  WHERE post."publish" = true AND post."userId" = ${userId})`,
      {
        nest: true,
        type: QueryTypes.SELECT
      });
  }

  async getUserSubscriptions(userId) {
    return this.subscriptionsService.getUserSubscribe(userId);
  }

  async getUser(userId) {
    const user = await this.userRepository.findByPk(userId, {
      attributes: ['id', 'nickname', 'email', 'avatar', 'banner', 'aboutUser', 'createdAt']
    });
    if (!user) {
      return new HttpException({ 'message': 'Пользователь не найден' }, HttpStatus.BAD_REQUEST);
    }
    const posts = await this.postsRepository.sequelize.query(`(SELECT 
    post."id", post."userId",post."title", post."data", post."publish", post."updatedAt", 
    (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'up' AND post."id" = rating."postId") - (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'down' AND post."id" = rating."postId") as "rating",
    author."id" AS "author.id", author."email" AS "author.email", author."nickname" AS "author.nickname", author."avatar" AS "author.avatar"
    FROM ((post
    LEFT OUTER JOIN users AS author ON post."userId" = "author"."id")
    LEFT OUTER JOIN rating ON post."id" = rating."postId"
    )  WHERE post."publish" = true AND post."userId" = ${userId})`,
      {
        nest: true,
        type: QueryTypes.SELECT
      });
    const subs = await this.subscriptionsService.getUserSubscribe(userId);
    return { user, posts, subs };
  }

}