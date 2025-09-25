import { envConfig } from "../config/envConfig.js";

const errorHandler = (err,req,res,next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong here";
    
    const response = {
        success: false,
        message,
    };

    if(envConfig.env === 'development' && err.stack){
        response.stack = err.stack;
    }

    res.status(statusCode).json(response)
}

export default errorHandler;