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
}
