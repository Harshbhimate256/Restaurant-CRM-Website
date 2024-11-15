import orderModel from "../models/orders.Model.js";
import userModel from "../models/userModel.js";

//here getting the order id which is at the top (i.e above customer array)
export const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find().populate("customer");
    res.status(201).json(orders);
  } catch (error) {
    console.log("error in all Orders controller", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};


export const allCustomers = async (req, res) => {
  try {
    const users = await userModel.find({ role: "customer" })
    .sort({createdAt: -1}); //sorting so that I can get the recent customer first
    // res.status(200).json(users)
    //accumulating all the customers in a variable before giving responce to server
    const Customers = users.map(user=>({
        fullname:user.fullname //I can store whatever I want to display to admin like orders etc.
    }))    
    res.status(200).json(Customers)
  } catch (error) {
    console.log("error in allCustomer controller", error);
    res.status(400).json({ message: "Error fetching all customers" });
  }
};
