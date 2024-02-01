import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('')
  @UseGuards(AuthGuard)
  async getOrders() {
    return this.ordersService.getOrders();
  }

  @Post('addOrder')
  @UseGuards(AuthGuard)
  async addOrder(
    @Body('products')
    products: Array<{ productId: string; quantity: number }>,
    @Request() req,
  ) {
    console.log(req);
    const mongoId = await this.ordersService.insertOrder(
      products,
      req.user.data.sub,
    );
    return mongoId;
  }

  @Get('getUserOrders')
  @UseGuards(AuthGuard)
  async getUserOrders(@Request() req) {
    console.log(req);
    const mongoId = await this.ordersService.getUserOrders(req.user.data.sub);
    return mongoId;
  }
}
