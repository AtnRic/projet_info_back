import {
  Controller,
  Get,
  Body,
  Post,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { diskStorage } from 'multer';
import { uuid } from 'uuidv4';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, callback) => {
          const name = uuid();
          const ext = extname(file.originalname);
          const filename = name + ext;
          callback(null, filename);
        },
      }),
    }),
  )
  async addProduct(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('price') price: number,
    @Body('quantity') quantity: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const mongoId = await this.productsService.insertProduct(
      name,
      description,
      price,
      quantity,
      'http://localhost:3000/public/' + file.filename,
    );
    return mongoId;
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, callback) => {
          const name = uuid();
          const ext = extname(file.originalname);
          const filename = name + ext;
          callback(null, filename);
        },
      }),
    }),
  )
  async updateProduct(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('price') price: number,
    @Body('quantity') quantity: number,
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const mongoId = await this.productsService.updateProduct(
      name,
      description,
      price,
      quantity,
        'http://localhost:3000/public/' + file.filename,
      id,
    );
    return mongoId;
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    console.log(id);
    const product = await this.productsService.deleteProduct(id);
    return product;
  }

  @Get('')
  async getProducts() {
    const products = await this.productsService.getProducts();
    return products;
  }

  @Get(':id')
  async getProduct(@Param('id') id: number) {
    const product = await this.productsService.getProduct(id);
    return product;
  }
}
