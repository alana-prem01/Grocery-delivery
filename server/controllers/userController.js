import User from '../models/user.js'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
//Resgister user :   /api/user/register

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser)
            return res.json({ success: false, message: 'User already exists' })

        const hashedPassword = await argon2.hash(password);
        const user = await User.create({ name, email, password: hashedPassword })
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.cookie('token', token, {
            httpOnly: true, //prevent javascript to access cookie
            secure: process.env.NODE_ENV === "production", //use secure cookies in production
            // production
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict', //CSRF production
            maxAge: 7 * 24 * 60 * 1000, //cookiw expiration time

        })

        return res.json({ success: true, user: { email: user.email, name: user.name } })
    } catch (error) {
        console.log(error.message);

        return res.json({ success: false, message: error.message })
    }
}

//Login user : /api/user/login

export const login = async (req,res)=>{
    try {
        const {email,password} = req.body

        if(!email || !password){
            return res.json({success:false,message : "Email and Password are required"})
        }

        const user =await User.findOne({email})

        if(!user){
             return res.json({success:false,message : "Invalid Email or Password "})
        }

        const isMatch =await argon2.verify(user.password, password)
        if(!isMatch)
             return res.json({success:false,message : "Invalid Email or Password "})

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.cookie('token', token, {
            httpOnly: true, //prevent javascript to access cookie
            secure: process.env.NODE_ENV === "production", //use secure cookies in production
            // production
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict', //CSRF production
            maxAge: 7 * 24 * 60 * 1000, //cookiw expiration time

        })

        return res.json({ success: true, user: { email: user.email, name: user.name } })
    } catch (error) {
         console.log(error.message);

         return res.json({ success: false, message: error.message })
    }
}

//check Auth : /api/user/is-auth

export const isAuth = async(req,res)=>{
    try {
        
        console.log("8888888",req.userId);
        
        const user = await User.findById(req.userId).select("-password") 
         return res.json({ success: true, user })

    } catch (error) {
        console.log(error.message);

         return res.json({ success: false, message: error.message })
    }
}

//Logout User : /api/user/logout

export const logout = async(req,res)=>{

    try {
        res.clearCookie('token',{
            httpOnly : true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict', 
            
        })
         return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error.message);

        return res.json({ success: false, message: error.message })
    }
}