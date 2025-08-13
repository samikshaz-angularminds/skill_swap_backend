const pick = (obj, keys) => {
    return keys.reduce((acc,key) => {
        if(obj && Object.prototype.hasOwnProperty.call(obj,key)){
            acc[key] = obj[key];
        }

        return acc;
    },{})
};

export default pick;