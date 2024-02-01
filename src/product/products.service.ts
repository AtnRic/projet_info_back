import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.model';
import { unlink } from 'fs';
import OpenAI from 'openai';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(
    name: string,
    price: number,
    quantity: number,
    picture: string,
  ): Promise<string> {
    const desc: string = await this.openAiDesc(name);
    console.log(desc);
    const product = new this.productModel({
      name,
      description: desc,
      price,
      quantity,
      picture,
    });
    const result = await product.save();
    return result.id;
  }

  openAiDesc = async (name) => {
    const gen =
      `Décrivez ` +
      name +
      ` en mettant l'accent sur  son goût de haute qualité. 
        Capturez l'essence de l'expérience gustative et suscitez 
        l'appétit du lecteur. Soyez créatif et utilisez un langage captivant pour 
        faire ressortir les caractéristiques uniques et délicieuses de ` +
      name +
      `La description doit être en français , courte, attrayante et adaptée aux spécificités et à la catégorie du produit.`;

    const openai = new OpenAI({
      apiKey: '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',
      dangerouslyAllowBrowser: true,
    });
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            ' You are an expert in copywriting, particularly in the field of food products.tu reponds en français.',
        },
        { role: 'user', content: gen },
      ],
      model: 'gpt-3.5-turbo-1106',
    });
    return completion.choices[0].message.content as string;
  };

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
      unlink('images' + product.picture.slice(31), (err) => {
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
    await unlink('images' + product.picture.slice(31), (err) => {
      if (err) {
        throw err;
      }
    });
    return product;
  }
}
