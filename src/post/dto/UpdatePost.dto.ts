import { IsArray, IsNumber, IsString, Length } from 'class-validator';

export class PostUpdateDto {

  @IsNumber()
  readonly postId: number;

  @IsString({ message: 'Должен быть строкой' })
  @Length(0, 60, { message: "Заг не должен быть больше 60 символов" })
  readonly title: string;

  @IsArray({ message: 'Должен быть масивом' })
  readonly data: [];
}
