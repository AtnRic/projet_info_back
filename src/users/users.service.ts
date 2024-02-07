import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { User } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/product/product.model';
import { Order } from 'src/orders/order.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);

    return await createdUser.save();
  }

  async findOne(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async find(email: string) {
    return await this.userModel.exists({ email: email });
  }

  async findAll() {
    return await this.userModel.find().exec();
  }

  async updateOne(
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    money: number,
  ) {
    const user = await this.userModel.findById(id);
    if (firstname) {
      user.firstname = firstname;
    }
    if (lastname) {
      user.lastname = lastname;
    }
    if (email) {
      user.email = email;
    }
    if (money) {
      user.money = Number(user.money) + Number(money);
    }
    await user.save();
    return user._id;
  }

  async deleteOne(id: number) {
    const user = await this.userModel.findByIdAndDelete(id);
    return user;
  }

  async getOrders(id: number) {
    const orders: Order[] = await this.orderModel.find({ userId: id });

    const result = [];
    for (const order of orders) {
      const products = [];
      for (const product of order.products) {
        if (product.productId.match(/^[0-9a-fA-F]{24}$/)) {
          const productResult = await this.productModel.findById(
            product.productId,
          );
          products.push(productResult);
        }
      }
      result.push({
        date: order.date,
        price: order.price,
        products: products,
      });
    }
    return result;
  }
}
