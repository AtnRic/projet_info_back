import mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  price: { type: Number, require: true },
  quantity: { type: Number, require: true },
  picture: { type: String, require: true },
});

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  picture: string;
}
