import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { FileModule } from '../file/file.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from '../post/model/Post.model';
import { Users } from '../users/model/Users.model';
import { Rating } from './model/Rating.model';

@Module({
  imports: [FileModule,
    SequelizeModule.forFeature([Post, Users, Rating])
  ],
  providers: [RatingService],
  exports: [RatingService]
})
export class RatingModule {
}
