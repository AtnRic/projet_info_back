import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { User } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
    console.log(id);
    const user = await this.userModel.findById(id);
    console.log(user);
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.money = money;
    console.log(user.money);
    await user.save();
    return user._id;
  }

  async deleteOne(id: number) {
    console.log('id3', id);
    const user = await this.userModel.findByIdAndDelete(id);
    return user;
  }
}
