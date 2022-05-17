import Product from "../Models/ProductModel.js";
import Order from "../Models/OrderModel.js";
import User from "../Models/UserModel.js"
import Cart from "../Models/CartModel.js"
import axios from "axios";

//get all orders
export const getOrders = (async(req, res)=>{
    try {
        const orders = await Order.find({}).populate({
            path: "cartItems",
            populate:{
                path: "cartItem",
                select: "_id item qty",
                populate: {
                    path: "item"
                }
            }
          }).populate({
              path: "customer",
          });
        return res.status(200).send(orders);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

//get one orders
export const getOrder = (async(req, res)=>{
    try {
        const order = await Order.findById({ _id: req.params.id }).populate({
            path: "cartItems",
            populate:{
                path: "cartItem",
                select: "_id item qty",
                populate: {
                    path: "item"
                }
            }
          }).populate({
            path: "customer",
        });
        if(!order) return res.status(404).send("Order not found");
        return res.status(200).send(order);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

//Add a order
export const createOrder = (async(req, res)=>{
    try {
        let order = new Order({...req.body});
        const user = await User.findById(order.customer)
        let tot = 0;

        //reduce quantity and add to sold items 
        await Promise.all(order.cartItems.map(async(i)=>{
            let cartItem = await Cart.findById(i.cartItem).populate({
                path: "item"
            });

            let product = await Product.findById(cartItem.item._id);

            product.quantity -= cartItem.qty;
            tot += cartItem.item.price * cartItem.qty;

            await Product.findByIdAndUpdate(product._id, product);
        }))

        order.totalPrice = tot;

        const savedOrder = await order.save();
        const emailData = {
            email: user.email,
            subject: 'Order Placed',
            message: `Your Order has been placed, Your order id is ${savedOrder._id}`
        }
        await axios.post(`${process.env.EMAIL_ENDPOINT}`, emailData);

        return res.status(201).send(savedOrder);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

//update a order
export const updateOrder = (async(req, res)=>{
    try {
        const order = await Order.findById({ _id: req.params.id });
        if(!order) return res.status(404).send("Order not found");
        await Order.updateOne({ _id: order._id }, {...req.body});
        return res.status(200).send("Order Updated");

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

//delete a product
export const deleteOrder = (async(req, res)=>{
    try {
        const order = await Order.findById({ _id: req.params.id });
        if(!order) return res.status(404).send("Order not found");
        await order.remove()
        return res.status(200).send("Order Removed");

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});