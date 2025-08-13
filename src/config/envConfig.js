// config.ts or config.js (ESM)

import dotenv from 'dotenv'
dotenv.config()

export const envConfig = {
  port: process.env.PORT,
  env : process.env.NODE_ENV,
  redis_url: process.env.REDIS_URL,
  mongo_url : process.env.MONGODB_URL,
  db_name: process.env.DB_NAME,
  cloudinary : {
    cloud_name : process.env.CLOUD_NAME,
    cloud_api_key : process.env.CLOUD_API_KEY,
    cloud_api_secret : process.env.CLOUD_API_SECRET
  },
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  google_failure_redirect_uri: process.env.GOOGLE_FAILURE_REDIRECT,
  google_success_redirect_uri: process.env.GOOGLE_SUCCESS_REDIRECT,
  google_callback_uri: process.env.GOOGLE_CALLBACK_URL,

  sender_email: process.env.SENDER_MAIL,
  sender_email_password: process.env.SENDER_MAIL_PASSWORD
}
