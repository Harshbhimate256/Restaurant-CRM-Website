export const admin = async(req,res,next)=>{
    if(req.user && req.user.role === 'admin'){
        next();
    }
    else{
        res.status(400).json({message:"not authorized as admin"});
    }
};