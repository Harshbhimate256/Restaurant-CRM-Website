import menuModel from "../models/menuModel.js";
import orderModel from "../models/orders.Model.js";
import userModel from "../models/userModel.js";

//adding menu
export const addItem = async (req, res) => {
  try {
    const { name, description, price, category, foodTag, foodType } = req.body;
    const newItem = new menuModel({
      name,
      description,
      price,
      category,
      foodTag,
      foodType,
    });
    await newItem.save();
    res.status(201).json({
      name: newItem.name,
      description: newItem.description,
      price: newItem.price,
      category: newItem.category,
      foodTag: newItem.foodTag,
      foodType: newItem.foodType,
      message: "Item added successfully",
    });
  } catch (error) {
    console.log("error adding Menu item");
    res.status(400).json({ error: "internal server error" });
  }
};

//Fetching menu
export const getItems = async (req, res) => {
  try {
    const newItems = await menuModel.find();
    res.status(201).json(newItems);
  } catch (error) {
    console.log("Error in getting items:", error);
    res.status(400).json({ error: "internal server error" });
  }
};

//Updating menu
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, foodTag, foodType } = req.body;

    const updatedItem = await menuModel.findByIdAndUpdate(
      id,
      { name, description, price, category, foodTag, foodType },
      { new: true } // for returning updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.status(201).json({
      updatedItem,
      message: "Item updated successfully",
    });
  } catch (error) {
    console.log("error while updating Brunch", error);
    res.status(400).json({ error: "internal server error" });
  }
};

//Deleting menu
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await menuModel.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: "item not found" });
    }
    res.status(200).json({
      message: "item deleted successfully",
    });
  } catch (error) {
    console.log("error while deleting the Item", error);
    res.status(400).json({ error: "internal server error" });
  }
};

//showing specific menu
export const getSpecificItem = async (req, res) => {
  try {
    const { id } = req.params;
    const specificItem = await menuModel.findById(id);
    res.status(201).json(specificItem);
  } catch (error) {
    console.log("error while showing item", error);
    res.status(400).json({ error: "internal server error" });
  }
};


//the order Id is accessed by fetching all the orders and from there the orderId is taken
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, newStatus } = req.body;
    if (!orderId || !newStatus) {
      return res
        .status(400)
        .json({ error: "Please provide order id and status" });
    }

    //Finding the order in order Model
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    //updating the order status in order model
    order.orderStatus = newStatus;
    await order.save();

    //Finding the user who placed the order and update the order status in ordermodel
    const user = await userModel.findById(order.customer);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the corresponding order in userModel
    const userOrder = user.orders.find((o) => o.item.toString() === order.items[0].item.toString());
    if (userOrder) {
      userOrder.orderStatus = newStatus;
      await user.save();
    }

    res.status(200).json({ message: "Order status updated successfully", orderStatus: newStatus });
  } catch (error) {
    console.log("error while updating order  status", error);
    res.status(400).json({ error: "internal server error" });
  }
};
