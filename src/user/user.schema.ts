import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class User extends Document {
  @ApiProperty({
    description: 'The full name of the user.',
    example: 'John Doe',
  })
  @Prop()
  name: string;

  @ApiProperty({
    description: 'The email address of the user. Must be unique.',
    example: 'user@example.com',
  })
  @Prop({ unique: true })
  email: string;

  @ApiProperty({
    description: 'The hashed password of the user.',
    example: 'hashedPasswordString',
  })
  @Prop()
  password: string;

  @ApiProperty({
    description: 'The role of the user.',
    example: 'user',
    default: 'user',
    enum: ['user', 'admin'],
  })
  @Prop({ default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);