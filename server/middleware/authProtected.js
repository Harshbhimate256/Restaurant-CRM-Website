import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

const protectedRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
       
        if(!token) {
            return res.status(401).json({error:"no token provided"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({error:"Unauthorized - invalid token"})
        }
        const user = await userModel.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(402).json({error:"user not found"})
        }
        req.user = user; //can access the data of the user
        next();
    } catch (error) {
        console.log("error in protected route",error.message);
        return res.status(500).json({error:"internal server error"});
    }
}

export default protectedRoute;