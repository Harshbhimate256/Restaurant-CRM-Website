export const customer = async(req,res,next)=>{
    if(req.user && req.user.role === 'customer'){
        next();
    }
    else{
        res.status(400).json({message:"not authorized as a customer"});
    }
}