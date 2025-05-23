import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, ConfigModule.forRoot({
    isGlobal:true,
    envFilePath: '.env'
  }),MongooseModule.forRoot(process.env.MONGO_URI || ''),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
