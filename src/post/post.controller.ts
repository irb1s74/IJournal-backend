import { Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PostService } from './post.service';
import { Request } from "express";
import { PostUpdateDto } from './dto/UpdatePost.dto';

@Controller('post')
export class PostController {
    constructor(private postsService: PostService) { }

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    createPost(@Req() request: Request) {
        return this.postsService.createPost(request)
    }

    // @Post('/create')
    // @UseGuards(JwtAuthGuard)
    // createPost( @Req() request: Request) {
    //     return this.postsService.createPost(request)
    // }

    @Post('/add/image')
    @UseInterceptors(FileInterceptor('image'))
    addImage(@UploadedFile() image) {
        return this.postsService.addImage(image)
    }

    @Post('/update')
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    updatePost(@Body() dto: PostUpdateDto, @Req() request: Request) {
        return this.postsService.updatePost(dto, request)
    }

}