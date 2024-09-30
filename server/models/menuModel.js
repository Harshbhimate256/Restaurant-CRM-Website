import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    category:{
        type:String,
        enum:["Veg","Non-Veg"],
        default:"Veg"
    },
    foodTag:[{
        type: String,
    }],
    foodType:{
        type:String,
        enum:["Brunch",'Lunch','Dinner'],
        default:'Brunch',
    }
},{timestamps:true});

const Menu = mongoose.model('Menu',menuSchema);
export default Menu;