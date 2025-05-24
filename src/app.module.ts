import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Load .env file globally
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    JwtModule.register({
      global: true, // Make JwtService available globally
      secret: process.env.SECRET_KEY || 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
    DocumentModule,
  ],
  controllers: [AppController], // Remove DocumentController
  providers: [AppService],
})
export class AppModule {}