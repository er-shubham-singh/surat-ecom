import express from 'express'
import cors from 'cors'
import  'dotenv/config'
import connectDb from './config/db.js'
const app = express()
app.use(express.json())
app.use(cors())
const PORT = process.env.PORT

/*........User........*/
import UserRoutes from './routes/user.routes.js'
app.use("/api",UserRoutes)

// product routes
import ProductRoutes from './routes/product.routes.js'
app.use("/api",ProductRoutes)
app.listen(PORT,
    async()=>{
        await connectDb()
        console.log("server run on : ",PORT)
    }
)