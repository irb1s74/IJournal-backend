import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { Controller, Get, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {
  }

  @Post('/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  updateAvatar(@UploadedFile() avatar, @Req() request: Request) {
    return this.profileService.updateAvatar(avatar, request);
  }

  @Post('/banner')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('banner'))
  updateBanner(@UploadedFile() banner, @Req() request: Request) {
    return this.profileService.updateBanner(banner, request);
  }

  @Get('/drafts')
  @UseGuards(JwtAuthGuard)
  getDrafts(@Req() request: { user: { id: number } }) {
    return this.profileService.getPostDrafts(request.user.id);
  }

  @Get('/publish')
  @UseGuards(JwtAuthGuard)
  getPublish(@Req() request: { user: { id: number } }) {
    return this.profileService.getPostPublish(request.user.id);
  }

  @Get('/:userId/publish')
  getPosts(@Param('userId') userId) {
    return this.profileService.getPostPublish(userId);
  }

  @Get('/:userId/subscriptions')
  getUserSubscriptions(@Param('userId') userId) {
    return this.profileService.getUserSubscriptions(userId);
  }

  @Get('/:userId')
  getUser(@Param('userId') userId) {
    return this.profileService.getUser(userId);
  }

}
