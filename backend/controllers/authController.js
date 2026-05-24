const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { generateAccessToken, generateRefreshToken } = require('../middleware/authMiddleware');

const registerUser = async (req, res) => {
    try {
       const {name, email, password, role} = req.body;

       const validRoles = ['admin', 'user'];
       if (role && !validRoles.includes(role.toLowerCase())) {
           return res.status(400).json({
               message: "Invalid role. Allowed roles: admin, user"
           });
       }

       const UserExist = await User.findOne({email});
       if (UserExist){
        return res.status(400).json({message:"user already exist"})
       }
       
    //    const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password,10);

       const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
       const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
       
       const user = await User.create({
          name, 
          email,
          password: hashedPassword,
          role: role ? role.toLowerCase() : 'user', // Default 'user' agar role nahi bheja, aur lowercase mein convert kro
          otp: generatedOtp,
          otpExpires: otpExpiry
       });

       if (user){
          try {
            const emailMessage = `Hello ${name}, \n\nThank You for registering. Your OTP for account verification is: \n\n${generatedOtp}\n\nThis Otp is valid for 5 minutes`;

            await sendEmail({
                email: user.email,
                subject: 'Account Verification OTP',
                message: emailMessage
            });

            return res.status(201).json({
                success: true,
                message: "User registered! Please check your email for the OTP.",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            })
          } catch (emailError){
               await User.findByIdAndDelete(user._id);
               return res.status(500).json({
                 message: "registration failed because verification email could not be sent. Please try again ",
                 error: emailError.message
               });
          }
        }

    } catch (error) {
        res.status(500).json({ message: "Server Error" , error: error.message});
    }
};

const verifyOtp = async(req,res) => {
    try{
        const {email, otp} = req.body;
        
        const user = await User.findOne({email});
        if (!user){
            return res.status(404).json({message:"user not found"});
        }
        if (user.isVerified){
            return res.status(400).json({message:"user is already verified. please login."});
        }
        if (user.otpExpires < Date.now()){
            return res.status(400).json({message: "OTP has expired. Please request a new one."});
        }
        if (user.otp !== otp){
            return res.status(400).json({message:"Invalid OTP.please try again."});
        }
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Account verified successfully! you can now login."
        });
    } catch(error){
        res.status(500).json({message:"Server Error", error: error.message });
    }
}

const loginUser = async (req,res) => {
    try{
        const {email,password} = req.body;

        const user = await User.findOne({email});
        if  (!user) {
            return res.status(400).json({message: "Invalid email or Password"})
        }
        if (!user.isVerified){
            return res.status(401).json({message: "please verify your account via OTP before logging in. "})
        } 
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({message: "invalid Email or Password"})
        }

        // Generate tokens using middleware functions
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.status(200).json({
            success: true,
            message: "login successful!",
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error){
        res.status(500).json({message: "server error", error: error.message});
    }
}


const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found with this email." });
        }

        
        if (user.isVerified) {
            return res.status(400).json({ message: "This account is already verified. Please login." });
        }

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

        
        user.otp = newOtp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendEmail({
            email: user.email,
            subject: "Your New OTP for Verification",
            message: `Your new OTP is: ${newOtp}. It is valid for 5 minutes.`
        });

        res.status(200).json({ message: "A fresh OTP has been sent to your email!" });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

module.exports = { registerUser, loginUser, verifyOtp, resendOTP };