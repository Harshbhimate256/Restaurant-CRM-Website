import express from "express";
const router = express.Router();
import {customer} from '../middleware/customerAuth.js'
import protectedRoute from "../middleware/authProtected.js";
import { checkoutBooking, createBooking, setPayment } from "../controllers/createBooking.controller.js";
import { isPayment } from "../middleware/paymentAuth.js";


router.post('/create',protectedRoute,customer,createBooking)
router.post('/:id/payment',protectedRoute,customer,setPayment)
router.post('/:id/checkout',protectedRoute,customer,isPayment,checkoutBooking)
export default router;