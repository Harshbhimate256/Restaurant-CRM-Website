import express from "express";
import protectedRoute from "../middleware/authProtected.js";
import { customer } from "../middleware/customerAuth.js";
import { addToCart, generateBill, removeFromCart, reviewItems, showCart } from "../controllers/cart.controller.js";
const router = express.Router();


//purchase/item/add-to-cart/:id?quantity=3 (the quantity will be passed as query from the frontend side)
router.post('/item/add-to-cart/:id',protectedRoute,customer,addToCart) 


//to get the items of the cart 
router.get('/show/cart',protectedRoute,customer,showCart)

//deleting item from the cart 
//purchase/delete/item/:id
router.delete('/delete/item/:itemId',protectedRoute,customer,removeFromCart)



//review purchase from the cart and entering the billing details before final payment
//purchase/review/items
router.post('/review/items',protectedRoute,customer,reviewItems)


//bill generation after checkout
router.get('/generate/bill',protectedRoute,customer,generateBill)
export default router;
