import { IsNumber, IsObject, IsString } from 'class-validator';

export class PostUpdateDto {
  @IsNumber()
  readonly postId: number;

  @IsString()
  readonly title: string;

  @IsObject({ message: 'Должен быть в формате JSON' })
  readonly data: {};
}
