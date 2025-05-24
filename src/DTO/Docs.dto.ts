import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DocumentDto {
  @ApiProperty({
    description: 'The title of the document.',
    example: 'Introduction to NestJS',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content or description of the document.',
    example: 'This document explains the basics of NestJS.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The email address of the user uploading the document.',
    example: 'user@example.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty({
    description: 'The category of the document.',
    example: 'Programming',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'A tag for the document.',
    example: 'Tutorial',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  tag: string;
}