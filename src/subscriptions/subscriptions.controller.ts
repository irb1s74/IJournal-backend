import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {
  }

  @Post('/to/subscribe')
  @UseGuards(JwtAuthGuard)
  toSubscribe(@Req() request: Request, @Body() dto: { userId: number }) {
    return this.subscriptionsService.toSubscribe(dto,request);
  }
}
