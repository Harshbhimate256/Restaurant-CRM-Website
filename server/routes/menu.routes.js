import express from "express";
import protectedRoute from "../middleware/authProtected.js";
import {getItems, getSpecificItem} from "../controllers/menu.controller.js";
import { customer } from "../middleware/customerAuth.js";
const router = express.Router();

//for displaying the menu (only for customer)
//menu/show/item
router.get('/show/item',protectedRoute, customer,getItems)


//for fetching specific item
//menu/show/unique/item/item id
router.get('/show/unique/item/:id',protectedRoute,getSpecificItem)

export default router;