class ApiError extends Error{
    constructor(statuscode, message, stack=''){
super(message);

this.statuscode = statuscode;

if(stack){
    this.stack = stack
}else{
    Error.captureStackTrace(this, this.constructor);
}
    }
}

export default ApiError;