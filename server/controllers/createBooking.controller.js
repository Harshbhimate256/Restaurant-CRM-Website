import bookingModel from '../models/bookingModel.js'

export const createBooking = async(req,res)=>{
    try {
        const {numberOfGuest,date,time,location} = req.body;
        const bookingDate = new Date(date);
        if(isNaN(bookingDate.getTime())){
            return res.status(400).json({error:"invalid date format"});
        }

        const booking = new bookingModel({
            user:req.user._id,
            numberOfGuest,
            date: bookingDate,
            time,
            location,
        });
        await booking.save();
        res.status(201).json({
            booking,
            message:"booking done successfully"
        })
    } catch (error) {
        console.log("error while creating booking: ",error);
        res.status(201).json({error: "internal server error"});
    }
}

export const setPayment = async(req,res)=>{
    try {
        const {id} =req.params;
        const {payment} = req.body;
        const validOptions = ['Card','Cash','Request booking'];
        if(!validOptions.includes(payment)){
            res.status(400).json({error:"payment option invalid"})
        }
        const booking = await bookingModel.findById(id)
        if(!booking){
            res.status(400).json({error:"booking not found"})
        }
        booking.payment = payment;
        await booking.save();
        res.status(201).json({message:"paymentt option added successfully"});
    } catch (error) {
        console.log("error  while setting up payment: ",error);
        res.status(201).json({error:"internal server error"});
    }
}

export const checkoutBooking = async(req,res)=>{
    try {
        const {id} =  req.params;//this is the booking id which have been generated while booking a table
        const booking = await bookingModel.findById(id);
        if(!booking){
            return res.status(404).json({error:"booking not found"});
        }
        booking.checkout = true;
        await booking.save();

        res.status(200).json({
            bill:booking.bill,
            message:"booking completed and bill generated successfully",
            payment:booking.payment
        })
    } catch (error) {
        console.log("error  while checking out booking: ",error);
        res.status(201).json({error:"internal server error"});
    }
}