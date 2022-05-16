import Product from "../Models/ProductModel.js";
import Order from "../Models/OrderModel.js";
import User from "../Models/UserModel.js"

//get all orders
export const getOrders = (async(req, res)=>{
    try {
        const orders = await Order.find({}).populate({
            path: "items",
            populate:{
                path: "item",
                select: "_id ItemName price",
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
            path: "items",
            populate:{
                path: "item",
                select: "_id ItemName price",
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

        // let orders = [];

        //reduce quantity and add to sold items 
        await Promise.all(order.items.map(async(i)=>{
            let product = await Product.findById(i.item);
            product.quantity -= i.qty;
            tot += product.price * i.qty;
            // orders.push({
            //     itemName: product.ItemName, 
            //     qty: i.qty,
            //     unitPrice: product.price,
            //     email: user.email
            // })
            await product.save();
        }))

        order.totalPrice = tot;
  
        // await Promise.all(order.items.map(async(i)=>{//delete all the cart items from the order
        //     await Cart.deleteMany({item: i.item});
        // }))

        const savedOrder = await order.save();

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