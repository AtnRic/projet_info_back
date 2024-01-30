import { BadRequestException, Injectable } from '@nestjs/common';
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
    if (!products) {
      return new BadRequestException('Missing products');
    }
    if (!price) {
      return new BadRequestException('Missing price');
    }
    console.log(products, price, userId);
    const product = new this.orderModel({
      products,
      price,
      userId,
      date: new Date(),
    });
    const result = await product.save();
    return result.id;
  }

  async getUserOrders(userId) {
    const result = await this.orderModel.find({ userId }).exec();
    return result;
  }
}
