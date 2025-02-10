import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'

import { generateToken } from "../utils/generateToken.js";
export const register = async  (req,res) =>{
    try {
    const {name, email, password} = req.body;
    if(!name || !email|| !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all fields"});
    }
    const user = await User.findOne({email});
    if (user) {
        return res.status(400).json({
            success: false,
            message: "Email already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await User.create({
        name,
        email,
        password:hashedPassword
    });
        return res.status(201).json({
            success: true,
            message: "User created successfully"
        })
        } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false ,
            message: "Internal Server Error"
        })
     }
 }

 export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
                });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
           });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
       }
        token = generateToken(res,user, `Login Successful ! ${user.name}`);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
}
export const logout = async (_,res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message:"Logged out successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to logout"
        }) 
    }
}