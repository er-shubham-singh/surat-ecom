import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
            required:true
        },
        streetAddress:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        zipCode:{
            type:String,
            required:true
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users"
        },
        mobile:{
            type:String
        }
})

const Address = mongoose.model("addresses", addressSchema)

export default Address
