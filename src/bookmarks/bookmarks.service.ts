import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Bookmarks } from './model/Bookmarks.model';

@Injectable()
export class BookmarksService {
  constructor(@InjectModel(Bookmarks) private bookmarksRepository: typeof Bookmarks) {}

  async toBookmarks(dto, request) {
    try {
      const [bookmark, created] = await this.bookmarksRepository.findOrCreate({
        where: {
          [Op.and]: [
            { postId: dto.postId },
            { userId: request.user.id }
          ]
        },
        defaults: {
          postId: dto.postId,
          userId: request.user.id
        }
      });
      if (!created) {
        await bookmark.destroy();
        return new HttpException({ message: 'bookmark has been deleted' }, HttpStatus.OK);
      }
      return new HttpException({ message: 'you have got to bookmark' }, HttpStatus.CREATED);
    } catch (error) {
      return new HttpException({ 'error': error }, HttpStatus.BAD_REQUEST);
    }
  }

}
