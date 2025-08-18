import ApiError from "./ApiError.js";
import { envConfig } from "../config/envConfig.js";

const errorHandler = (err,req,res,next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong here";

    res.status(statusCode).json({
        success: false,
        message,
        ...new ApiError(envConfig.env === 'development' && {stack: err.stack})

    })
}

export default errorHandler;