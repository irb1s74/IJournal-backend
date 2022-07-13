import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PostService } from './post.service';
import { Request } from 'express';
import { PostUpdateDto } from './dto/UpdatePost.dto';

@Controller('post')
export class PostController {
  constructor(private postsService: PostService) {
  }

  @Get('/new')
  getNewPost() {
    return this.postsService.getNewPosts();
  }

  @Get('/popular')
  getPopularPost() {
    return this.postsService.getPopularPosts();
  }


  @Post('/create')
  @UseGuards(JwtAuthGuard)
  createPost(@Req() request: Request) {
    return this.postsService.createPost(request);
  }

  @Post('/add/image')
  @UseInterceptors(FileInterceptor('image'))
  addImage(@UploadedFile() image) {
    return this.postsService.addImage(image);
  }

  @Post('/update')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  updatePost(@Body() dto: PostUpdateDto, @Req() request: Request) {
    return this.postsService.updatePost(dto, request);
  }

  @Post('/increase')
  @UseGuards(JwtAuthGuard)
  increaseRatingPost(@Body() dto: { postId: number }, @Req() request: Request) {
    return this.postsService.increaseRatingPost(dto.postId, request);
  }

  @Post('/decrease')
  @UseGuards(JwtAuthGuard)
  decreaseRatingPost(@Body() dto: { postId: number }, @Req() request: Request) {
    return this.postsService.decreaseRatingPost(dto.postId, request);
  }

  @Get('/publish/:id')
  @UseGuards(JwtAuthGuard)
  toPublishPost(@Param('id') postId) {
    return this.postsService.toPublishPost(postId);
  }

  @Get('/unPublish/:id')
  @UseGuards(JwtAuthGuard)
  toUnPublishPost(@Param('id') postId) {
    return this.postsService.toUnPublishPost(postId);
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard)
  deletePost(@Param('id') postId) {
    return this.postsService.deletePost(postId);
  }
}
