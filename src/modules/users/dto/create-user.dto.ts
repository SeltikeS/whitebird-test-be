import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email должен быть валидным' })
  email: string;

  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  @MinLength(4, { message: 'Пароль должен содержать минимум 4 символа' })
  password: string;
}
