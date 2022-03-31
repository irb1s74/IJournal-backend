import {IsEmail, IsString, Length} from 'class-validator';

export class UserLoginDto {

  @IsString({message: 'Должен быть строкой'})
  @IsEmail({}, {message: "Некорректный email"})
  readonly email: string;

  @IsString({message: 'Должен быть строкой'})
  readonly password: string;
}
