import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Rating } from './model/Rating.model';
import { literal, Op } from 'sequelize';

@Injectable()
export class RatingService {
  constructor(@InjectModel(Rating) private ratingRepository: typeof Rating) {
  }

  async createRating(userId: number, postId: number, ratingType: string) {
    try {
      const [rating, created] = await this.ratingRepository.findOrCreate({
        where: {
          userId,
          postId,
          [Op.or]: [
            { ratingType: 'up' },
            { ratingType: 'down' }
          ]
        },
        defaults: {
          ratingType
        }
      });
      if (!created && rating.ratingType === ratingType) {
        await rating.destroy();
        return new HttpException({ 'message': 'Rating was removed' }, HttpStatus.OK);
      }
      rating.ratingType = ratingType;
      await rating.save();
      return await this.ratingRepository.findByPk(rating.id, {
        attributes: {
          include: [[literal(`(SELECT((SELECT COUNT("ratingType") FROM rating WHERE "ratingType" = 'up' AND "id" = ${rating.id}) - (SELECT COUNT("ratingType") FROM rating WHERE "ratingType" = 'down' AND "id" = ${rating.id})) as "rating" from rating WHERE "id" = ${rating.id})`), 'rating']]
        }
      });
    } catch (e) {
      return new HttpException({ 'error': 'Что-то пошло не так' }, HttpStatus.BAD_REQUEST);
    }
  }

}
