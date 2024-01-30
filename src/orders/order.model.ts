/* eslint-disable @typescript-eslint/ban-types */
import mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
  date: { type: Date, require: true },
  products: {
    type: Array<{ productId: String; quantity: Number }>,
    require: true,
  },
  userId: { type: String, require: true },
  price: { type: Number, require: true },
});

export interface Order {
  date: Date;
  products: { productId: String; quantity: number };
  userId: string;
  price: number;
}
