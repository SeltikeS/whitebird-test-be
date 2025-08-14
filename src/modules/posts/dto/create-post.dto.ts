import { IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  priority?: number;
}
