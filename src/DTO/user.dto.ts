import { IsEmail, IsNotEmpty, IsOptional, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'The email address of the user. Must be a valid email format.',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'The password for the user. Must be at least 5 characters long and contain at least one letter and one number.',
    example: 'Pass123',
    required: true,
    minLength: 5,
    pattern: '^(?=.*[A-Za-z])(?=.*\\d).{5,}$',
  })
  @IsNotEmpty()
  @MinLength(5, { message: 'Password must be at least 5 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{5,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @ApiProperty({
    description: 'The full name of the user.',
    example: 'John Doe',
    required: false, 
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Name cannot be empty if provided' })
  name: string;
}