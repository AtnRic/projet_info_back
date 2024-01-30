import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('findAll')
  @UseGuards(AuthGuard)
  async findAll(@Request() req) {
    console.log(req);
    const mongoId = await this.usersService.findAll();
    return mongoId;
  }
}
