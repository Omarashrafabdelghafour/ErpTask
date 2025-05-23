import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/DTO/user.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/Guards/Authentication.guard';
import { Roles } from 'src/Decorators/roles.decorator';
import { Role } from 'src/Decorators/roles.enum';
import { RolesGuard } from 'src/Guards/roles.guard';
@Controller('user')

@UseInterceptors(AnyFilesInterceptor())
export class UserController {
constructor (private userservice: UserService){}
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Post("register")
// Removed as properties are now defined in UserDto


 async register(@Body()  user:UserDto){
    return await this.userservice.register(user);  
}
@Post("login")

async login(@Body() user:UserDto){
  return await this.userservice.login(user);
}
@UseGuards(AuthGuard, RolesGuard) 
@Roles(Role.Admin)
@Get("all")
async all(){
  return "All users";


}
}
