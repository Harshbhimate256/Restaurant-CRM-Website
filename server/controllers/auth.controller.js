import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

export const signup = async(req,res)=>{
    try {
        const {fullname,username,password,confirmPassword,role} =req.body;
        if(password != confirmPassword){
            return res.status(400).json({error:"passwords do not match"});
        }
        const user  = await userModel.findOne({username});
        if(user){
            res.status(400).json({error:"username already exists"})
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);


        const newUser = new userModel({
            fullname,
            username,
            password:hashedPassword,
            role
        });
        if(newUser){
            //generate JWT token
            generateToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                username:newUser.username,
                role:newUser.role,
                message:"user signup successfull"
            })
        }
        else{
            res.status(400).json({error:"invalid user data"})
        }

    } catch (error) {
        console.log("error in signup controller", error.message);
        res.status(500).json({error:"internal server error"});
    }
}
export const login = async(req,res)=>{
    try {
        const {username,password} = req.body;
        const user = await userModel.findOne({username});
        const checkPassword = await bcrypt.compare(password,user?.password || "");
        if(!user || !checkPassword){
            res.status(400).json({error:"invalid credentials"});
        }
        generateToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            username:user.username,
            role:user.role,
            message:"user logged in successfull"
        })
    } catch (error) {
        console.log("error in login controller",error.message);
        res.status(500).json({error:"internal server error"});
    }
}
export const logout = async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"user logged out successfully"})
    } catch (error) {
        console.log("error in logout controller",error.message);
        res.status(500).json({error:"internal server error"});
    }
}