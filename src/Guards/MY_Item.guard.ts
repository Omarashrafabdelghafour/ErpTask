import { Injectable, CanActivate, ExecutionContext, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Docs } from 'src/document/document.schema';
import { Document } from 'mongoose';
type DocsDocument = Docs & Document;

@Injectable()
export class MY_Item implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Docs.name) private docsModel: Model<DocsDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Extract token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return false;
    }

    // Get document ID from request params
    const itemId = request.params.id;
    if (!itemId) {
      throw new BadRequestException('Item ID is missing');
    }

    // Fetch document
    const doc = await this.docsModel.findById(itemId).exec();
    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    // Verify JWT and check ownership
    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: process.env.SECRET_KEY });
      const email = payload.email;
      return email === doc.jwt_owner; // Allow access if user owns the document
    } catch (error) {
      console.error('JWT verification failed:', error);
      return false;
    }
  }
}