import express from 'express';
import path from 'path'
import dotenv from 'dotenv'
import connectMongoDB from './DB/connectDB.js';
import authRoutes from './routes/auth.routes.js'
import menuRoutes from './routes/menu.routes.js'
import bookingRoutes from './routes/booking.routes.js'
import purchaseRoute from './routes/purchase.routes.js'
import adminRoute from './routes/forAdmin.routes.js'
import cookieParser from 'cookie-parser';
const app = express();


const PORT = process.env.PORT || 3010;
const __dirname = path.resolve();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.get("/",async(req,res,next)=>{
    res.send("Hello Worldd");
})

app.use('/api/auth',authRoutes);
app.use('/menu',menuRoutes);
app.use('/purchase',purchaseRoute);
app.use('/booking',bookingRoutes);
app.use('/admin',adminRoute);


app.listen(PORT,()=>{
    connectMongoDB();
    console.log(`server is running at port ${PORT}`);
});