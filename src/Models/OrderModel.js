import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  items:[
    {
        item:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        qty:{
            type: Number,
            required: true
        }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  customer:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status:{
    type: String,
    required: true,
    default: "Pending"
  },
  payment:{
    paymentMethod:{
      type: String
    },
    status:{
      type: String
    }
  }
},{ timestamps: true });

let Order = mongoose.model("Order", OrderSchema);

export default Order;
