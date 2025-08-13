import mongoose from 'mongoose';
import { envConfig } from './envConfig.js';
export const connectDB = async (app) => {
    try {
        
        await mongoose.connect(envConfig.mongo_url+envConfig.db_name)    
        
        const server = app.listen(envConfig.port, () => console.log(`listening to ${envConfig.port}`))
        
        return server;
    } catch (error) {
        console.error("MongoDB connection has failed!", error.message);
        process.exit();
    }
}
