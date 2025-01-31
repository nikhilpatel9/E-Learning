import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
export const register = async function (res,req) {
    try {
    const {name, email, password} = req.body;
    if(!name||!email||!password) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Please fill all fields"});
        }
    const user = await User.findOne({email});
    if (user) {
        return res.status(400).json({
            status: 'Bad Request',
            message: "Email already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });
        await newUser.save();
        res.status(201).json({
            status: 'Success',
            message: "User created successfully"
        });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 'Error',
                message: "Internal Server Error"
                });
        }
 }
