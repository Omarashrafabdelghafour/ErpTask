import { IsEmail, IsNotEmpty, Matches, MinLength, IsOptional, IsString } from 'class-validator';


export class UserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(5, { message: 'Password must be at least 5 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{5,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}

