import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from './profile.service';
import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
}
