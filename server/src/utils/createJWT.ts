import jwt from "jsonwebtoken";

import dotenv from 'dotenv'
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
if(!JWT_SECRET){
    throw new Error("JWT secret key not available")
}

export const createJWT = (user: { id: string; email: string }): string=>{
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        JWT_SECRET,
        {
            expiresIn:"1d"
        }
    )

    return token
}
