import express from "express";
import { addItem, deleteItem, getItems, updateItem, updateOrderStatus } from "../controllers/menu.controller.js";
import { admin } from "../middleware/adminAuth.js";
import protectedRoute from "../middleware/authProtected.js";
import { allCustomers, allOrders } from "../controllers/admin.controller.js";
const router = express.Router();


//These controllers are inside menu controller as it coming under menu section


//for adding the menu
//admin/add/item
router.post('/add/item',protectedRoute,admin,addItem);

//for displaying the menu
//admin/show/item
router.get('/show/item',protectedRoute, admin,getItems)

//for updating the menu
//admin/update/item/item id
router.put('/update/item/:id',protectedRoute,admin,updateItem)

//for deleting the menu
//admin/delete/:item id
router.delete('/delete/:id',protectedRoute,admin,deleteItem)

//for updating the order status 
//admin/update/order/status
router.put('/update/order/status',protectedRoute,admin,updateOrderStatus)



/*---------This is under admin controller ------------*/

//for fetching all orders of customers
//admin/all/orders
router.get('/all/orders',protectedRoute,admin,allOrders)

//for fetching all the customers
//admin/all/customers
router.get('/all/customers',protectedRoute,admin,allCustomers)


//for fetching all the orders made by each customer
//admin/all/orders/customer id

export default router; 