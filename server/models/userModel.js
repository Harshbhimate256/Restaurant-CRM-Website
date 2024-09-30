import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    contact: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "chief", "customer"],
      default: "customer",
    },
    cart: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    orders: [{
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        orderStatus: {
          type: String,
          enum: ["pending","out for delivery" ,"delivered"],
          default: "pending",
        },
        OrderTime: {
          type: Date,
          default:Date.now
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
