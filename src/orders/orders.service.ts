import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Order } from './order.model';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/product/product.model';
import {User} from "../users/users.schema";

interface Order2 {
  order: Order;
  user: User;
  products: Product[]
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async getOrders() {
    let orders2: Array<Order2> = [];
    let orders = await this.orderModel.find().exec();
    for (const order of orders) {
      const user = await this.userModel.findById(order.userId).exec();
      const products = [];
      for (const product of order.products) {
        const produit = await this.productModel.findById(product.productId).exec;
        products.push(produit);
      }
      orders2.push({order, user, products})
    }

    return orders2;
  }

  async insertOrder(
    products: Array<{ productId: string; quantity: number }>,
    userId: string,
  ) {
    if (!products) {
      throw new BadRequestException('Missing products');
    }
    let total = 0;
    for (const product of products) {
      console.log(product);
      const result = await this.productModel.findById(product.productId);
      total = total + result.price * product.quantity;
    }
    const product = new this.orderModel({
      products,
      price: total,
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
