import mongoose from "mongoose";

export async function connectMongoDb(url) {
    try {
        return mongoose.connect(url);
    } catch (error) {
        console.log("AN error has been occurred: ", error);

        return false;

    }
}


