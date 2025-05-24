import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Docs, DocsSchema } from './document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Docs.name, schema: DocsSchema }]),
  ],
  controllers: [DocumentController], // Include DocumentController
  providers: [DocumentService],
})
export class DocumentModule {}