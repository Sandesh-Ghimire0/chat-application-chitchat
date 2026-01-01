import express from 'express'
import cors from 'cors'

export const app = express();

app.get('/',(_,res)=>{
    res.send("Server is running")
})

app.use(cors())
app.use(express.json())



//====================================================
import { authRouter } from './routes/authRoute.js';
import { userRouter } from './routes/userRoute.js';

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/user',userRouter)