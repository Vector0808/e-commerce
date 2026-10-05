 const User = require("../models/users.js");
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");
 
 const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "7d"});
 }

 //register 
 //otp handling will be done in the future

 const registerUser = async (req,res) => {
    const {name,email,password,confirmpassword} = req.body;
    try {
        // Input validation
        if (!name || !email || !password || !confirmpassword) {
            return res.status(400).json({message: "All fields are required"});
        }
         if (password !== confirmpassword) {
             return res.status(400).json({message: "Passwords do not match"});
         }
         
         const existingUser = await User.findOne({email});
         if (existingUser) {
             return res.status(400).json({message: "User already exists"});
         }
         const salt = await bcrypt.genSalt(12);
         const hashedpassword = await bcrypt.hash(password,salt)
         const newUser = await User.create({
             name,
             email,
             password : hashedpassword
         });
         res.status(201).json({message: "User registered successfully",
             _id: newUser._id,
             name: newUser.name,
             email: newUser.email,
             token: generateToken(newUser._id),
             role: newUser.role
         });
         
     } catch (error) {
         console.error("Register error:", error);
         res.status(500).json({message: "Internal server error"});
     }
  }

  //login

     const loginUser = async (req,res) => {
         const {email,password} = req.body;
         try {
             if (!email || !password) {
                 return res.status(400).json({message: "Email and password are required"});
             }
             
             const foundUser = await User.findOne({email});
             if (!foundUser) {
                 return res.status(400).json({message: "Invalid email or password"});
             }
             const isMatch = await bcrypt.compare(password, foundUser.password);
             if (!isMatch) {
                 return res.status(400).json({message: "Invalid email or password"});
             }
             res.status(200).json({message: "Login successful",
                 _id: foundUser._id,
                 name: foundUser.name,
                 email: foundUser.email,
                 token: generateToken(foundUser._id),
                 role: foundUser.role
             });
            
         } 
         catch (error) {
             console.error("Login error:", error);
             res.status(500).json({message: "Internal server error"});
         }
     }

     //get user data

     const getUserdata = async (req,res) => {    
         
         try {
             const Users = await User.find({}).select("-password");
             res.json(Users); 
         } catch (error) {
             console.error("Get users error:", error);
             res.status(500).json({message: "Internal server error"});
         }
     }

 module.exports = {registerUser, loginUser, getUserdata};
