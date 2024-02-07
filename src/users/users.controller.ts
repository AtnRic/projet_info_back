import {
  Controller,
  Get,
  Patch,
  Body,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('findAll')
  // @UseGuards(AuthGuard)
  async findAll() {
    const mongoId = await this.usersService.findAll();
    return mongoId;
  }

  @Patch('')
  @UseGuards(AuthGuard)
  async update(
    @Request() req,
    @Body('firstname')
    firstname: string,
    @Body('lastname')
    lastname: string,
    @Body('email')
    email: string,
    @Body('money')
    money: number,
  ) {
    const mongoId = await this.usersService.updateOne(
      req.user.data.sub,
      firstname,
      lastname,
      email,
      money,
    );
    return mongoId;
  }

  @Patch(':id')
  async updateOne(
    @Param('id')
    id: number,
    @Body('firstname')
    firstname: string,
    @Body('lastname')
    lastname: string,
    @Body('email')
    email: string,
    @Body('money')
    money: number,
  ) {
    const mongoId = await this.usersService.updateOne(
      id,
      firstname,
      lastname,
      email,
      money,
    );
    return mongoId;
  }

  @Delete(':id')
  async delete(
    @Param('id')
    id: number,
  ) {
    const mongoId = await this.usersService.deleteOne(id);
    return mongoId;
  }

  @Get('orders')
  @UseGuards(AuthGuard)
  async getOrders(@Request() req) {
    const mongoId = await this.usersService.getOrders(req.user.data.sub);
    return mongoId;
  }
}
