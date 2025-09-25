import ApiError from '../errors/ApiError.js'

const validate = (schema) => (req,res,next) => {
    const result = schema.validate(req.body);

    if(result.error){
        return next(new ApiError(httpStatus.BAD_REQUEST, result.error.details[0].message));
    }

    next();
};

export default validate;