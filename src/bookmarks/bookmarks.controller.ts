import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private bookmarksService: BookmarksService) {
  }

  @Post('/to/bookmark')
  @UseGuards(JwtAuthGuard)
  toBookmarks(@Req() request: Request, @Body() dto: { postId: number }) {
    return this.bookmarksService.toBookmarks(dto, request);
  }
}
