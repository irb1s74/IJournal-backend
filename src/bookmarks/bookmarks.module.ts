import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { Bookmarks } from './model/Bookmarks.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Bookmarks]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET_DEV',
      signOptions: {
        expiresIn: '72h'
      }
    })
  ],
  providers: [BookmarksService],
  controllers: [BookmarksController]
})
export class BookmarksModule {
}
