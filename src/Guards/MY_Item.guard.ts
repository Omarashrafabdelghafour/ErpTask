import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
//import { DocumentService } from "src/document/document.service";

@Injectable()
export class MY_Item implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return false;
    }

    const itemId = request.params.id;
    if (!itemId) {
      throw new BadRequestException('Item ID is missing');
    }

    // const doc = await this.docs.getdocbyid(itemId);
    // if (!doc) {
    //   return false;
    // }
    
  //   try {
  //     const payload = await this.jwtService.verifyAsync(token, { secret: process.env.SECRET_KEY });
  //     console.log('Token payload:', payload);
  //     const email = payload.email;
  //     console.log('Token email:', email);
  //     console.log('Document author:', doc.author);
      
  //     if (email === doc.author) {
  //       return true;
  //     }
  //     return false;
  //   } catch (error) {
  //     console.error('JWT verification failed:', error);
  //     return false;
  //   }
     return true;
   }
}
