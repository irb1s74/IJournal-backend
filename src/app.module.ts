import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { PostModule } from './post/post.module';
import { ProfileModule } from './profile/profile.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { RatingModule } from './rating/rating.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { Subscriptions } from './subscriptions/model/Subscriptions.model';
import { Users } from './users/model/Users.model';
import { Bookmarks } from './bookmarks/model/Bookmarks.model';
import { Post } from './post/model/Post.model';
import { Rating } from './rating/model/Rating.model';
import * as path from 'path';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static')
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Users, Post, Subscriptions, Rating, Bookmarks],
      autoLoadModels: true
    }),
    UsersModule,
    AuthModule,
    FileModule,
    PostModule,
    ProfileModule,
    SubscriptionsModule,
    RatingModule,
    BookmarksModule
  ]
})
export class AppModule {
}
