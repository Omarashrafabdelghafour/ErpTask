import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/DTO/user.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/Guards/Authentication.guard';
import { Roles } from 'src/Decorators/roles.decorator';
import { Role } from 'src/Decorators/roles.enum';
import { RolesGuard } from 'src/Guards/roles.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Users') // Group endpoints under 'Users' in Swagger UI
@Controller('user')
@UseInterceptors(AnyFilesInterceptor())
export class UserController {
  constructor(private userservice: UserService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 201, description: 'User successfully registered', type: UserDto })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async register(@Body() user: UserDto) {
    return await this.userservice.register(user);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() user: UserDto) {
    return await this.userservice.login(user);
  }

  @Get('all')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth() // Indicates this endpoint requires a Bearer token
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  @ApiResponse({ status: 403, description: 'Forbidden: Admin access required' })
  @ApiResponse({ status: 401, description: 'Unauthorized: Invalid or missing token' })
  async all() {
    return await this.userservice.all();
  }
}