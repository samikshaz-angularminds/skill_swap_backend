import jwt from "jsonwebtoken";
import { envConfig } from "../config/envConfig.js";


export default function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.sendStatus(401);

    jwt.verify(token, envConfig.access_token_secret,(err,user) => {
        if(err) return res.sendStatus(403);
        req.user = user;        
        next();
    })
    
}