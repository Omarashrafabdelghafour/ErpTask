import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Docs extends Document {
  @ApiProperty({
    description: 'The title of the document.',
    example: 'Introduction to NestJS',
    required: true,
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: 'The content or description of the document.',
    example: 'This document explains the basics of NestJS.',
    required: true,
  })
  @Prop({ required: true })
  content: string;

  @ApiProperty({
    description: 'The email address of the user who uploaded the document.',
    example: 'user@example.com',
    required: true,
  })
  @Prop({ required: true })
  author: string;

  @ApiProperty({
    description: 'The date the document was created.',
    example: '2025-05-24T15:35:00.000Z',
    default: 'Current date',
  })
  @Prop({ default: Date.now })
  date: Date;

  @ApiProperty({
    description: 'The category of the document.',
    example: 'Programming',
    required: true,
  })
  @Prop({ required: true })
  category: string;

  @ApiProperty({
    description: 'A tag for the document.',
    example: 'Tutorial',
    required: true,
  })
  @Prop({ required: true })
  tag: string;

  @ApiProperty({
    description: 'The email of the user who owns the document (from JWT).',
    example: 'user@example.com',
    required: true,
  })
  @Prop({ required: true })
  jwt_owner: string;

  @ApiProperty({
    description: 'The file path of the uploaded TXT, PDF, PPT, PPTX, DOC, or DOCX document.',
    example: 'uploads/documents/intro_nestjs.pdf',
    required: true,
  })
  @Prop({ required: true })
  file: string;
}

export const DocsSchema = SchemaFactory.createForClass(Docs);