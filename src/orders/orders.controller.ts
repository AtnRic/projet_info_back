// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { OrdersService } from './orders.service';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';

// @Controller('orders')
// export class OrdersController {
//   constructor(private readonly ordersService: OrdersService) {}

//   @Post('addOrder')
//   async addOrder(
//     @Body('products')
//     products: Array<{ productId: string; quantity: number }>,
//     @Body('price') price: number,
//   ) {
//     const mongoId = await this.ordersService.insertOrder(products, price);
//     return mongoId;
//   }
// }
