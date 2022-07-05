import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subscriptions } from './model/Subscriptions.model';
import { Op } from 'sequelize';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscriptions) private subscriptionsRepository: typeof Subscriptions
  ) {
  }


  async toSubscribe(dto, request) {
    try {
      const [subscribe, created] = await this.subscriptionsRepository.findOrCreate({
        where: {
          [Op.and]: [
            { subscriberId: request.user.id },
            { userId: dto.userId }
          ]
        },
        defaults: {
          subscriberId: request.user.id,
          userId: dto.userId
        }
      });
      console.log(created);
      if (!created) {
        await subscribe.destroy();
        return new HttpException({ message: 'subscribe has been deleted' }, HttpStatus.OK);
      }
      return new HttpException({ message: 'you have got to subscribe' }, HttpStatus.CREATED);
    } catch (error) {
      return new HttpException({ 'error': error }, HttpStatus.BAD_REQUEST);
    }
  }
}
