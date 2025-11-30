import { IsEmail, IsNotEmpty, IsString, MinLength, IsNumber, Min, Max, IsArray } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;
}

export class CompleteProfileDto {
  @IsNumber()
  @Min(0)
  @Max(54)
  handicap!: number;

  @IsString()
  @IsNotEmpty()
  trainingObjective!: string;

  @IsArray()
  @IsString({ each: true })
  favoriteCourseIds!: string[];
}
