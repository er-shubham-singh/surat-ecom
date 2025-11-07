import mongoose from 'mongoose'
import 'dotenv/config'
const MONGO_URI = process.env.MONGO_URI

 const connectDb =  async ()=> {
    try {
        await mongoose.connect(MONGO_URI)
        console.log(" Mongo connected successfully")
    } catch(err){
        console.error("mongo db connection failed", err.message)
    }
}

 export default connectDb