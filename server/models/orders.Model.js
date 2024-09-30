import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    items:[{
        item:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Menu"
        },
        quantity:{
            type:Number,
            default:1
        },
        price:{
            type:Number,
        }
    }],
    orderStatus:{
        type:String,
        enum: ["pending","out for delivery" ,"delivered"],
        default: "pending",
    },
    orderTime:{
        type:Date,
        default:Date.now
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    ZipCode:{
        type:Number,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    paymentMethod:{
        type:String,
        enum:["cash","card","cash on delivery"],
        required:true
    },
    shippingCharge:{
        type:Number,
        default:50
    }
    
},{timestamps:true})

const Order = mongoose.model("Order",orderSchema)
export default Order;