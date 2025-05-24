import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Docs } from './document.schema';
import { DocumentDto } from '../DTO/Docs.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel(Docs.name) private docsModel: Model<Docs>,
    private jwtService: JwtService,
  ) {}

  async addDocs(dto: DocumentDto, file: Express.Multer.File, token: string): Promise<Docs> {
    if (
      !file ||
      ![
        'text/plain',
        'application/pdf',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
      ].includes(file.mimetype)
    ) {
      throw new BadRequestException('Only TXT, PDF, PPT, PPTX, DOC, or DOCX files are allowed');
    }

    const payload = await this.jwtService.verifyAsync(token, { secret: process.env.SECRET_KEY });
    const email = payload.email;

    const doc = new this.docsModel({
      ...dto,
      file: file.path,
      jwt_owner: email,
    });
    return await doc.save();
  }

  async updateDocs(id: string, dto: DocumentDto, file?: Express.Multer.File): Promise<Docs> {
    const updateData: any = { ...dto };
    if (file) {
      if (
        ![
          'text/plain',
          'application/pdf',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(file.mimetype)
      ) {
        throw new BadRequestException('Only TXT, PDF, PPT, PPTX, DOC, or DOCX files are allowed');
      }
      updateData.file = file.path;
    }
    const updatedDoc = await this.docsModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedDoc) {
      throw new BadRequestException('Document not found');
    }
    return updatedDoc;
  }

  async getDocById(id: string): Promise<Docs> {
    const doc = await this.docsModel.findById(id).exec();
    if (!doc) {
      throw new BadRequestException('Document not found');
    }
    return doc;
  }

  async getAllDocs(): Promise<Docs[]> {
    return await this.docsModel.find().exec();
  }
}