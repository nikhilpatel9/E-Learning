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

 export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: 'Bad Request',
                message: "Please fill all fields"
                });
        }
        const user = User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                status: 'Unauthorized',
                message: "Invalid email or password"
           });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                status: 'Unauthorized',
                message: "Invalid email or password"
            });
       }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY,
                {
                 expiresIn: '1h'
                });
            res.status(200).json({
                status: 'Success',
                message: "Login successful",
                token
                });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 'Error',
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