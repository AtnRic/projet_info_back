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
import { Order } from './order.model';
import { User } from '../users/users.schema';

interface Order2 {
  order: Order;
  user: User;
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('')
  @UseGuards(AuthGuard)
  async getOrders(): Promise<Array<Order2>> {
    return this.ordersService.getOrders();
  }

  @Post('addOrder')
  @UseGuards(AuthGuard)
  async addOrder(
    @Body('products')
    products: Array<{ productId: string; quantity: number }>,
    @Request() req,
  ) {
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
