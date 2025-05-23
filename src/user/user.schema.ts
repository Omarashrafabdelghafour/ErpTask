import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: true }) // Ensure email is unique
  email: string;

  @Prop()
  password: string;

  @Prop({ default: "user" })
  role: string;

  @Prop({ default: '' })  // Store Google Drive image link
  profileImage: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
