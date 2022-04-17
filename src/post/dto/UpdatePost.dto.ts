import { IsNumber, IsObject } from 'class-validator';

export class PostUpdateDto {
  @IsNumber()
  readonly postId: number;

  @IsObject({ message: 'Должен быть в формате JSON' })
  readonly data: {};
}
