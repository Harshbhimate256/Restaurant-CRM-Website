import menuModel from "../models/menuModel.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orders.Model.js";

export const addToCart  = async(req,res)=>{
    try {
        
        const userId = req.user._id;
        const {id} = req.params;
        const {quantity} = req.query;
        const user = await userModel.findById(userId);
        
        //validating user
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        //validate item exists
        const item = await menuModel.findById(id);
        if(!item){
            return res.status(404).json({message:"item not found"})
        }

        //add the item with the specific quantity to user cart
        const cartItem = {
            item:id,
            quantity:Number(quantity) || 1,
        };

        user.cart.push(cartItem);
        await user.save()

        res.status(201).json({
            cart:user.cart,
            message:"item added to cart"
        })

    } catch (error) {
        console.log("error in add to cart controller", error);
        res.status(401).json({error:"internal server error"});
    }
}

export const showCart = async (req, res) => {
  try {
    const userId = req.user._id;
    if(!userId){
        return res.status(401).json({message: "User ID not found"})
    }
    const user = await userModel.findById(userId)
    .populate({
      path:"cart.item",
      model:"Menu"
    })

    if(!user){
      return res.status(404).json({message:"user not found"})
    }
    
    if(user.cart.length === 0){
        return res.status(200).json({message: "cart is empty"})
    }
    

    //adding subtotal 
    let subtotal = 0;
    user.cart.forEach(cartItem => {
      const itemPrice = cartItem.item.price;
      const itemQuantity = cartItem.quantity || 1;
      subtotal += itemPrice * itemQuantity;
    });

    //adding shipping charge
    const shippingCharge = 50;
    const total = subtotal + shippingCharge;

    
    res.status(201).json({
      cart:user.cart,
      subtotal:subtotal,
      shippingCharge:shippingCharge,
      total:total
    })
    
  } catch (error) {
    console.log("error in showCart controller", error);
    res.status(401).json({ message: "internal server error" });
  }
};

export const removeFromCart = async(req,res)=>{
    const {itemId} = req.params;
    const userId = req.user._id;
    try {
        if(!userId){
            return res.status(401).json({message: "User ID not found"})
        }
    
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        
        //filter out the item to be removed from the cart
        user.cart = user.cart.filter((cartItem) => cartItem._id.toString() !== itemId)
        await user.save();
        
        //checking if the cart is empty or not
        if(user.cart.length === 0){
            return res.status(200).json({message: "cart is empty"})
        }
        
        return res.status(200).json({
            cart:user.cart,
            message:"item removed successfully"
        })
    } catch (error) {
        console.log("error in removing the item from cart",error)
        res.status(401).json({message:"internal server error"})
    }
    
}

export const reviewItems = async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        address,
        city,
        ZipCode,
        phoneNumber,
        email,
        paymentMethod,
      } = req.body;
  
      const userId = req.user._id;
      if (!userId)
        return res.status(400).json({ message: "Please login to review items" });
  
      const user = await userModel.findById(userId).populate("cart.item");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      //checking if the user cart is empty or not
      if (user.cart.length === 0) {
        return res.status(400).json({ message: "Your cart is empty" });
      }
  
      // Validating payment method
      const validPaymentMethods = ["cash", "card", "cash on delivery"];
      if (!validPaymentMethods.includes(paymentMethod)) {
        return res.status(400).json({ message: "Invalid payment method" });
      }
  
      //create order details
      const orderDetails = new orderModel({
        customer: userId,
        items: user.cart.map((cartItem) => ({
          item: cartItem.item._id,
          quantity: cartItem.quantity,
          price: cartItem.item.price,
        })),
        firstName,
        lastName,
        address,
        city,
        ZipCode,
        phoneNumber,
        email,
        paymentMethod,
      });
  
      //saving the order in ordermodel for admin
      await orderDetails.save();
  
      //here,updating the user order history and clearing the cart
      user.orders.push(
        ...user.cart.map((cartItem) => ({
          item: cartItem.item._id,
          quantity: cartItem.quantity,
          orderStatus: "pending",
          OrderTime: Date.now(),
        }))
      );
  
      //clear the cart
      user.cart = [];
  
      //save the updated user data
      await user.save();
      return res.status(201).json({
        orderDetails,
        message: "order placed successfully",
      });
    } catch (error) {
      console.log("error in review Items controller", error);
      res.status(404).json({ message: "internal server error" });
    }
};
  
export const generateBill = async(req,res)=>{
    try {
      const userId = req.user._id;

    //fetching latest order placed by user
    const order = await orderModel.findOne({customer:userId})
    .sort({orderTime: -1}) //for fetching the most recent order
    .populate("items.item") //item field populated


    if(!order) {
      return res.status(404).json({message: "no order found"})
    }


    const itemsTotal = order.items.reduce((acc, item) => {
      return acc + item.quantity * item.item.price;
      }, 0);


    //structuring the bill for easy understanding
    const billDetails = {
      customerName : `${order.firstName} ${order.lastName}`,
      email: order.email,
      phoneNumber: order.phoneNumber,
      address: `${order.address}, ${order.city} , Zip: ${order.ZipCode}`,
      paymentMethod: order.paymentMethod,
      OrderTime: order.orderTime,
      items: order.items.map((item)=>({
        name:item.item.name,
        quantity:item.quantity,
        price:item.price,
        total:item.quantity * item.item.price,
      })),
      itemsTotal: itemsTotal,
      shippingCharge:order.shippingCharge,
      totalAmount: itemsTotal+ order.shippingCharge
    }

    return res.status(201).json({
      bill:billDetails,
      message:"bill generated successfully"
    });

    } catch (error) {
        console.log("error while generating bill", error)
        res.status(404).json({message: "internal server error"})
    }
}