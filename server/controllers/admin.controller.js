import orderModel from "../models/orders.Model.js";


//here getting the order id which is at the top (i.e above customer array)
export const allOrders = async(req,res)=>{
    try {
        const orders = await orderModel.find().populate('customer');
        res.status(201).json(orders);
    } catch (error) {
        console.log("error in all Orders controller",error)
        res.status(500).json({ message: 'Error fetching orders' });
    }
}