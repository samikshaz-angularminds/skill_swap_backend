import { envConfig } from "../config/envConfig.js";
import httpStatus from 'http-status';

const errorHandler = (err,req,res,next) => {
    let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
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