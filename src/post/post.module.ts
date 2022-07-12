import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FileModule } from 'src/file/file.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './model/Post.model';
import { JwtModule } from '@nestjs/jwt';
import { Users } from '../users/model/Users.model';
import { Rating } from '../rating/model/Rating.model';
import { RatingModule } from '../rating/rating.module';

@Module({
  imports: [
    FileModule,
    RatingModule,
    SequelizeModule.forFeature([Post, Users, Rating]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET_DEV',
      signOptions: {
        expiresIn: '72h'
      }
    })],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {
}
