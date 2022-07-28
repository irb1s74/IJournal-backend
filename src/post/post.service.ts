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

  async getPost(id: number) {
    return this.postsRepository.sequelize.query(`(SELECT 
    post."id", post."userId",post."title", post."data", post."publish", post."updatedAt", 
    (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'up' AND post."id" = rating."postId") - (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'down' AND post."id" = rating."postId") as "rating",
    author."id" AS "author.id", author."email" AS "author.email", author."nickname" AS "author.nickname", author."avatar" AS "author.avatar"
    FROM ((post
    LEFT OUTER JOIN users AS author ON post."userId" = "author"."id")
    LEFT OUTER JOIN rating ON post."id" = rating."postId"
    )  WHERE post."publish" = true AND post."id" = ${id} ORDER BY post."updatedAt" DESC)`,
      {
        nest: true,
        type: QueryTypes.SELECT
      });
  }

  async getNewPosts() {
    return this.postsRepository.sequelize.query(`(SELECT 
    post."id", post."userId",post."title", post."data", post."publish", post."updatedAt", 
    (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'up' AND post."id" = rating."postId") - (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'down' AND post."id" = rating."postId") as "rating",
    author."id" AS "author.id", author."email" AS "author.email", author."nickname" AS "author.nickname", author."avatar" AS "author.avatar"
    FROM ((post
    LEFT OUTER JOIN users AS author ON post."userId" = "author"."id")
    LEFT OUTER JOIN rating ON post."id" = rating."postId"
    )  WHERE post."publish" = true ORDER BY post."updatedAt" DESC)`,
      {
        nest: true,
        type: QueryTypes.SELECT
      });
  }

  async getPopularPosts() {
    return this.postsRepository.sequelize.query(`(SELECT 
    post."id", post."userId",post."title", post."data", post."publish", post."updatedAt", 
    (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'up' AND post."id" = rating."postId") - (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'down' AND post."id" = rating."postId") as "rating",
    author."id" AS "author.id", author."email" AS "author.email", author."nickname" AS "author.nickname", author."avatar" AS "author.avatar"
    FROM ((post
    LEFT OUTER JOIN users AS author ON post."userId" = "author"."id")
    LEFT OUTER JOIN rating ON post."id" = rating."postId"
    )  WHERE post."publish" = true AND DATE_PART('day', CURRENT_TIMESTAMP - post."createdAt"::timestamp) < 31 ORDER BY "rating" DESC)`,
      {
        nest: true,
        type: QueryTypes.SELECT
      });
  }

  async getSubPosts(userId: number) {
    return await this.postsRepository.sequelize.query(`(SELECT post."id", post."userId",post."title", post."data", post."publish", post."updatedAt", 
    (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'up' AND post."id" = rating."postId") - (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'down' AND post."id" = rating."postId") as "rating",
     author."id" AS "author.id", author."email" AS "author.email", author."nickname" AS "author.nickname", author."avatar" AS "author.avatar"
     FROM ((subscriptions LEFT OUTER JOIN users AS author ON subscriptions."userId" = "author"."id")
           LEFT OUTER JOIN post ON subscriptions."userId" = post."userId"
    ) WHERE subscriptions."subscriberId" = ${userId} AND post."publish" = true ORDER BY post."updatedAt" DESC)`, {
      nest: true,
      type: QueryTypes.SELECT
    });
  }

  async getBookmarksPosts(userId: number) {
    return await this.postsRepository.sequelize.query(`(SELECT post."id", post."userId", post."title", post."data",post."publish", post."updatedAt", 
    (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'up' AND post."id" = rating."postId") - (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'down' AND post."id" = rating."postId") as "rating",
     author."id" AS "author.id", author."email" AS "author.email", author."nickname" AS "author.nickname", author."avatar" AS "author.avatar"
     FROM ((bookmarks LEFT OUTER JOIN users AS author ON bookmarks."userId" = "author"."id")
           LEFT OUTER JOIN post ON bookmarks."postId" = post."id"
    ) WHERE bookmarks."userId" = ${userId} ORDER BY post."updatedAt" DESC)`, {
      nest: true,
      type: QueryTypes.SELECT
    });
  }

  async findPosts(content: string) {
    return await this.postsRepository.sequelize.query(`(SELECT 
    post."id", post."userId",post."title", post."data", post."publish", post."updatedAt", 
    (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'up' AND post."id" = rating."postId") - (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'down' AND post."id" = rating."postId") as "rating",
    author."id" AS "author.id", author."email" AS "author.email", author."nickname" AS "author.nickname", author."avatar" AS "author.avatar"
    FROM ((post
    LEFT OUTER JOIN users AS author ON post."userId" = "author"."id")
    LEFT OUTER JOIN rating ON post."id" = rating."postId"
    )  WHERE LOWER(post."title") LIKE LOWER('%${content}%') AND post."publish" = true ORDER BY "rating" DESC)`, {
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
      post.title = dto.title;
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
    await this.ratingService.createRating(request.user.id, postId, 'up');
    const rating = await this.postsRepository.sequelize.query(`(SELECT (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'up' AND ${postId}  = rating."postId") - (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'down' AND ${postId} = rating."postId") as "rating")`,
      {
        type: QueryTypes.SELECT
      });

    return rating[0];
  }

  async decreaseRatingPost(postId, request) {
    await this.ratingService.createRating(request.user.id, postId, 'down');
    const rating = await this.postsRepository.sequelize.query(`(SELECT (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'up' AND ${postId}  = rating."postId") - (SELECT COUNT(rating."ratingType") FROM rating WHERE rating."ratingType" = 'down' AND ${postId} = rating."postId") as "rating")`,
      {
        type: QueryTypes.SELECT
      });
    return rating[0];
  }
}
