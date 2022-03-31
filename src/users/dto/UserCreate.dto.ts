import {IsEmail, IsString, Length} from 'class-validator';

export class UserCreateDto {
  @IsString({message: 'Должен быть строкой'})
  @IsEmail({}, {message: "Некорректный email"})
  readonly email: string;

  @IsString({message: 'Должен быть строкой'})
  @Length(1, 20, {message: "Ник не должен быть меньше 1 и не больше 20 символов"})
  readonly nickname: string;

  @IsString({message: 'Должен быть строкой'})
  @Length(4,1000, {message: "Пароль не должен быть меньше 4 символов"})
  readonly password: string;
}
