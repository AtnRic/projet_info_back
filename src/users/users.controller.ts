import { Controller, Get, Patch, Body, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('findAll')
  // @UseGuards(AuthGuard)
  async findAll() {
    const mongoId = await this.usersService.findAll();
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
    console.log('id', id);
    const mongoId = await this.usersService.deleteOne(id);
    return mongoId;
  }
}
