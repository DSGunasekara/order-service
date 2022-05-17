import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
    item:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    qty:{
        type: Number,
        required: true
    },
  customer:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
},{ timestamps: true });

let Cart = mongoose.model("Cart", CartSchema);

export default Cart;