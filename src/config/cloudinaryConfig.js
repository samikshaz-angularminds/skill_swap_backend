import {v2 as cloudinary} from "cloudinary"
import { envConfig } from "./envConfig.js"

cloudinary.config({
    cloud_name: envConfig.cloudinary.cloud_name,
    api_key: envConfig.cloudinary.cloud_api_key,
    api_secret: envConfig.cloudinary.cloud_api_secret
})

export default cloudinary;