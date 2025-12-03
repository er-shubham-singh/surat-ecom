const jwtProvider=require("../config/jwtProvider")
const userService=require("../services/user.service")


const authenticate = async(req,res,next)=>{

    try {
        const token=req.headers.authorization?.split(" ")[1]
        if(!token){
            return res.status(404).send({message:"token not found"})
        }

        const userId=jwtProvider.getUserIdFromToken(token);
        const user=await userService.findUserById(userId);

        req.user=user;
    } catch (error) {
        return res.status(500).send({error:error.message})
    }
    next();
}

module.exports=authenticate;

// middleware/authenticate.js

// const jwt = require("jsonwebtoken");
// const jwtProvider = require("../config/jwtProvider");
// const userService = require("../services/user.service");
// const mongoose = require("mongoose");

// const authenticate = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization || "";
//     const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies?.token;
//     console.log(`[AUTH] ${req.method} ${req.originalUrl} tokenPreview: ${token ? token.slice(0,8) + '...' + token.slice(-8) : 'no-token'}`);

//     if (!token) return res.status(401).json({ message: "Authentication token not provided" });

//     // Decode for debugging only (dev)
//     const decoded = jwt.decode(token);
//     console.log("[AUTH] decoded payload:", decoded);

//     let userId;
//     try {
//       userId = jwtProvider.getUserIdFromToken(token); // should verify token and return field used at sign
//     } catch (err) {
//       return res.status(401).json({ message: "Invalid or expired token" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(401).json({ message: "Invalid user id in token" });
//     }

//     const user = await userService.findUserById(userId);
//     if (!user) {
//       console.warn(`[AUTH] token valid but user not found for id ${userId} — possible deleted/forged token`);
//       return res.status(401).json({ message: "User not found for provided token" });
//     }

//     req.user = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       superCoins: user.superCoins,
//     };

//     next();
//   } catch (error) {
//     console.error("Authentication middleware error:", error);
//     return res.status(500).json({ message: "Server error during authentication" });
//   }
// };
// module.exports = authenticate;
