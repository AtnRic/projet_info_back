import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Order } from './order.model';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async insertOrder(
    products: Array<{ productId: string; quantity: number }>,
    price: number,
    userId: string,
  ) {
    const product = new this.orderModel({
      products,
      price,
      userId,
    });
    const result = await product.save();
    return result.id;
  }
}
