/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateStatDto } from './dto/create-stat.dto';
import { UpdateStatDto } from './dto/update-stat.dto';
import { Model } from 'mongoose';
import { Order } from 'src/orders/order.model';
import { Product } from 'src/product/product.model';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/users.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  create(createStatDto: CreateStatDto) {
    return 'This action adds a new stat';
  }

  findAllOrders = async () => {
    const orders = await this.orderModel.find();
    return orders as Order[];
  };

  async findAll() {
    const orders = await this.findAllOrders();
    const products = await this.productModel.find();
    const users = await this.userModel.find();
    orders.sort(function (a, b): any {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    console.log('orders', orders);
    let total = 0;
    let quantity: number = 0;
    const monthPrice = Array(12).fill(0);
    const monthProduct = Array(12).fill(0);
    for (const order of orders) {
      const products = order.products;
      const month = new Date(order.date).getUTCMonth();
      for (const product of products) {
        quantity = Number(quantity) + Number(product.quantity);
        monthProduct[month] += product.quantity;
      }
      if (order.price !== undefined) {
        total += order.price;
        monthPrice[month] += order.price;
      }
    }
    console.log({
      monthIncome: monthPrice,
      totalIncome: total,
      totalOrder: orders.length,
      totalProductSold: quantity,
    });
    return {
      monthIncome: monthPrice,
      monthProduct: monthProduct,
      totalIncome: total,
      totalOrder: orders.length,
      totalProductSold: quantity,
      totalUser: users.length,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} stat`;
  }

  update(id: number, updateStatDto: UpdateStatDto) {
    return `This action updates a #${id} stat`;
  }

  remove(id: number) {
    return `This action removes a #${id} stat`;
  }
}
