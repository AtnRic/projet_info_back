import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Order } from './order.model';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/product/product.model';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async getOrders() {
    return await this.orderModel.find().exec()
  }

  async insertOrder(
    products: Array<{ productId: string; quantity: number }>,
    userId: string,
  ) {
    if (!products) {
      return new BadRequestException('Missing products');
    }
    let total = 0;
    for (const product of products) {
      const result = await this.productModel.findById(product.productId);
      total = total + result.price * product.quantity;
    }
    const product = new this.orderModel({
      products,
      total,
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
