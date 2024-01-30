import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.model';
import { unlink } from 'fs';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(
    name: string,
    description: string,
    price: number,
    quantity: number,
    picture: string,
  ): Promise<string> {
    const product = new this.productModel({
      name,
      description,
      price,
      quantity,
      picture,
    });
    const result = await product.save();
    return result.id;
  }

  //   async deleteProduct(id: string): Promise<string> {
  //     const product = new this.productModel({
  //       name,
  //       description,
  //       price,
  //       quantity,
  //       picture,
  //     });
  //     const result = await product.save();
  //     return result.id;
  //   }

  async updateProduct(
    name: string,
    description: string,
    price: number,
    quantity: number,
    picture: string,
    id: number,
  ) {
    const product = await this.productModel.findById(id);
    if (!product) {
      return new NotFoundException('Could not find the product with id: ' + id);
    }
    if (name) {
      product.name = name;
    }
    if (description) {
      product.description = description;
    }
    if (price) {
      product.price = price;
    }
    if (picture) {
      unlink('images' + product.picture.slice(28), (err) => {
        if (err) {
          throw err;
        }
        console.log('Delete File successfully.');
      });
      product.picture = picture;
    }
    if (quantity) {
      product.quantity = quantity;
    }
    const result = await product.save();
    return result.id;
  }

  async getProducts(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    return products as Product[];
  }

  async getProduct(id: number) {
    const product = await this.productModel.findById(id);
    if (!product) {
      return new NotFoundException('Could not find the product with id: ' + id);
    }
    return product as Product;
  }

  async deleteProduct(id: number) {
    const product = await this.productModel.findByIdAndDelete(id);
    console.log(product);
    if (!product) {
      return new NotFoundException('Could not find the product with id: ' + id);
    }
    await unlink('images' + product.picture.slice(28), (err) => {
      if (err) {
        throw err;
      }
    });
    return product;
  }
}