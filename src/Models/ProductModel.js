import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  ItemName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description:{
    type: String
  },
  images:{
      type: String,
  },
  quantity:{
      type: Number,
      default: 0
  },
});

let Product = mongoose.model("Product", ProductSchema);

export default Product;