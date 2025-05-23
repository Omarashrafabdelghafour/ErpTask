import { Module } from '@nestjs/common';
import { User, UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports:[MongooseModule.forFeature([{name:'User',schema:UserSchema}]),
    JwtModule.register({
        secret: process.env.SECRET_KEY,
        signOptions: { expiresIn: process.env.secret_key_expire },
      })

],
    controllers:[UserController],
    providers:[UserService],
})
export class UserModule {}
