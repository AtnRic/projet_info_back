import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() data: { email: string; password: string }) {
    return await this.authService.login(data);
  }

  @Post('verify')
  async verify(@Body() body: { token: string }) {
    return await this.authService.verify(body.token);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    return await this.authService.profile(req.user);
  }
}
