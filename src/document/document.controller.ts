import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentService } from './document.service';
import { DocumentDto } from '../DTO/Docs.dto';
import { Docs } from './document.schema';
import { MY_Item } from '../Guards/MY_Item.guard';
import { AuthGuard } from '../Guards/Authentication.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiConsumes, ApiParam } from '@nestjs/swagger';

@ApiTags('Documents')
@Controller('documents')
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @Post('add')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new document (TXT, PDF, PPT, or DOCX)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Introduction to NestJS' },
        content: { type: 'string', example: 'This document explains the basics of NestJS.' },
        author: { type: 'string', example: 'user@example.com', description: 'The email address of the user uploading the document' },
        category: { type: 'string', example: 'Programming' },
        tag: { type: 'string', example: 'Tutorial' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['title', 'content', 'author', 'category', 'tag', 'file'],
    },
  })
  @ApiResponse({ status: 201, description: 'Document successfully added', type: Docs })
  @ApiResponse({ status: 400, description: 'Invalid input or file type (only TXT, PDF, PPT, DOCX allowed)' })
  @ApiResponse({ status: 401, description: 'Unauthorized: Invalid or missing token' })
  async addDocs(
    @Body() documentDto: DocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const token = req.headers.authorization.split(' ')[1];
    return await this.documentService.addDocs(documentDto, file, token);
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard, MY_Item)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './Uploads/documents',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a document by ID (owner only)' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'Document ID', example: '60c72b2f9b1e8c1a4c8b4567' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Updated Introduction to NestJS' },
        content: { type: 'string', example: 'Updated content about NestJS.' },
        author: { type: 'string', example: 'user@example.com', description: 'The email address of the user updating the document' },
        category: { type: 'string', example: 'Programming' },
        tag: { type: 'string', example: 'Tutorial' },
        file: { type: 'string', format: 'binary', nullable: true },
      },
      required: ['title', 'content', 'author', 'category', 'tag'],
    },
  })
  @ApiResponse({ status: 200, description: 'Document successfully updated', type: Docs })
  @ApiResponse({ status: 400, description: 'Invalid input or document not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized: Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden: Not the document owner' })
  async updateDocs(
    @Param('id') id: string,
    @Body() documentDto: DocumentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.documentService.updateDocs(id, documentDto, file);
  }

  @Get(':id')
  @UseGuards(AuthGuard, MY_Item)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a document by ID (owner only)' })
  @ApiParam({ name: 'id', description: 'Document ID', example: '60c72b2f9b1e8c1a4c8b4567' })
  @ApiResponse({ status: 200, description: 'Document found', type: Docs })
  @ApiResponse({ status: 400, description: 'Document not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized: Invalid or missing token' })
  @ApiResponse({ status: 403, description: 'Forbidden: Not the document owner' })
  async getDocById(@Param('id') id: string) {
    return await this.documentService.getDocById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents (public)' })
  @ApiResponse({ status: 200, description: 'List of all documents', type: [Docs] })
  async getAllDocs() {
    return await this.documentService.getAllDocs();
  }
}