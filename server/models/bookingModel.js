import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    numberOfGuest:{
        type:Number,
        default:1
    },
    date:{
        type:Date,
        required:true
    },
    time:{
        type:String
    },
    location:{
        type:String,
        enum:["Balcony","Private","Dine-in"]
    },
    checkout:{
        type:Boolean,
        default:false
    },
    bill:{
        type:Object,
        default:null
    },
    payment:{
        type:String,
        enum:['Card','Cash','Request booking']
    }
    
},{timestamps:true})



bookingSchema.pre('save',function(next){
    if(this.checkout && !this.bill){
        this.bill = this.calculateBill();
    }
    next();
})

bookingSchema.methods.calculateBill = function(){
    const defaultPrice = 100;
    const guestPrice = 20;
    const locationPrice = {
        'Balcony': 50,
        'Private' : 70,
        'Dine-in': 30
    }
    //calculating individual component
    const guestCost = guestPrice * (this.numberOfGuest - 1); //if there is no guest than no charges include for guest
    const locationCost = locationPrice[this.location]

    const totalCost = defaultPrice + guestCost + locationCost;

    //returning detailed bill
    return { 
        numberOfGuest:this.numberOfGuest,
        guestCost:guestCost,//later delete this line
        location:this.location,
        locationCost:locationCost,
        totalCost:totalCost
    };
}

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;