import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Bookmarks } from './model/Bookmarks.model';
import { PostService } from '../post/post.service';

@Injectable()
export class BookmarksService {
  constructor(@InjectModel(Bookmarks) private bookmarksRepository: typeof Bookmarks,
              private postService: PostService) {
  }

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
        return this.postService.getBookmarksPosts(request.user.id);
      }
      return this.postService.getBookmarksPosts(request.user.id);
    } catch (error) {
      return new HttpException({ 'error': error }, HttpStatus.BAD_REQUEST);
    }
  }

}
