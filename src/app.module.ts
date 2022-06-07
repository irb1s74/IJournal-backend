import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UsersModule } from './users/users.module';
import { Users } from './users/model/Users.model';
import { AuthModule } from './auth/auth.module';
import { FileModule } from './file/file.module';
import { PostModule } from './post/post.module';
import * as path from 'path';
import { Post } from './post/model/Post.model';
import { ProfileModule } from './profile/profile.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Users, Post],
      autoLoadModels: true,
    }),
    UsersModule,
    AuthModule,
    FileModule,
    PostModule,
    ProfileModule,
  ],
})
export class AppModule {}
