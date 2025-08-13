import nodemailer from "nodemailer";
import { envConfig } from "../config/envConfig.js";


export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: envConfig.sender_email,
    pass: envConfig.sender_email_password
  }
})