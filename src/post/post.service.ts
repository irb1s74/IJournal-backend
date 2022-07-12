import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileService } from 'src/file/file.service';
import { Post } from './model/Post.model';
import { RatingService } from '../rating/rating.service';
import { QueryTypes } from 'sequelize';


@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post) private postsRepository: typeof Post,
    private fileService: FileService,
    private ratingService: RatingService
  ) {
  }

  async getPost() {
    return this.postsRepository.sequelize.query(`(SELECT 
"Post"."id", "Post"."userId", "Post"."data", "Post"."publish", "Post"."createdAt", "Post"."updatedAt", 
(SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'up' AND "Post"."id" = rating."postId") - (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'down' AND "Post"."id" = rating."postId") as "rating",
"author"."id" AS "author.id", "author"."email" AS "author.email", "author"."nickname" AS "author.nickname", "author"."avatar" AS "author.avatar", "author"."banner" AS "author.banner", "author"."banned" AS "author.banned", "author"."banReason" AS "author.banReason", "author"."aboutUser" AS "author.aboutUser", "author"."createdAt" AS "author.createdAt" 
FROM (("post" AS "Post" 
 LEFT OUTER JOIN "users" AS "author" ON "Post"."userId" = "author"."id")
 LEFT OUTER JOIN rating ON "Post"."id" = rating."postId"
)  WHERE "Post"."publish" = true)`,
      {
        nest: true,
        type: QueryTypes.SELECT
      });
  }

  async createPost(req) {
    return this.postsRepository.create({ userId: req.user.id });
  }

  async addImage(image: any) {
    const fileName = await this.fileService.createFile(image, 'posts');
    return {
      success: 1,
      file: {
        url: `http://localhost:5000/posts/${fileName}`
      }
    };
  }

  async updatePost(dto, request) {
    try {
      const post = await this.postsRepository.findByPk(dto.postId);
      if (post.userId !== request.user.id) {
        return new HttpException(
          { message: 'Вы не являетесь автором поста' },
          HttpStatus.BAD_REQUEST
        );
      }
      post.data = dto.data;
      await post.save();
      return new HttpException(post, HttpStatus.OK);
    } catch (e) {
      return new HttpException({ 'error': 'Что-то пошло не так' }, HttpStatus.BAD_REQUEST);
    }

  }

  async toPublishPost(postId) {
    try {
      const post = await this.postsRepository.findByPk(postId);
      post.publish = true;
      await post.save();
      return new HttpException(post, HttpStatus.OK);

    } catch (e) {
      return new HttpException({ 'error': 'Что-то пошло не так' }, HttpStatus.BAD_REQUEST);
    }
  }

  async toUnPublishPost(postId) {
    try {
      const post = await this.postsRepository.findByPk(postId);
      post.publish = false;
      await post.save();
      return new HttpException(post, HttpStatus.OK);
    } catch (e) {
      return new HttpException({ 'error': 'Что-то пошло не так' }, HttpStatus.BAD_REQUEST);
    }
  }

  async deletePost(postId) {
    try {
      await this.postsRepository.destroy({ where: { id: postId } });
      return new HttpException({ message: 'post has been deleted' }, HttpStatus.OK);
    } catch (e) {
      return new HttpException({ 'error': 'Что-то пошло не так' }, HttpStatus.BAD_REQUEST);
    }
  }

  async increaseRatingPost(postId, request) {
    return await this.ratingService.createRating(request.user.id, postId, 'up');
  }

  async decreaseRatingPost(postId, request) {
    return await this.ratingService.createRating(request.user.id, postId, 'down');
  }
}
