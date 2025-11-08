import bcrypt from 'bcrypt'
import  * as userServices from '../services/user.services.js'
import * as jwtProvide from '../config/jwtProvider.js'

const register = async(req,res)=>{
    try{
        const userData = req.body
        const user = await userServices.registerUser(userData)
        const jwt = jwtProvide.generateToken(user._id)
        return res.status(200).json({jwt,message:"register succesfully"})
    } catch (err){
        return res.status(500).send({error:err.message})
    }
}

const login = async 