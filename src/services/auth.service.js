import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import User from "../models/user.model.js";
import { envConfig } from '../config/envConfig.js';
import ApiError from '../errors/ApiError.js';
import redisClient from '../config/redis.js';
import { transporter } from '../utils/sendEmailUtil.js';
import { OAuth2Client } from "google-auth-library"
import {randomUUID} from 'crypto'


const client = new OAuth2Client(envConfig.google_client_id);

//geenerate 
const generateAccessToken = (user) => {
  // console.log("user in access token: ", user);

  const payload = {
    id: user._id.toString(),
    uid: user.uid,
    email: user.email,
    username: user.username,
  };

  return jwt.sign(payload, envConfig.access_token_secret, { expiresIn: '1h' });
}

const generateRefreshToken = (user) => {
  // console.log("user in refresh token: ", user);
  const payload = {
    id: user._id.toString(),
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(payload, envConfig.refresh_token_secret, { expiresIn: '7d' });
  refreshTokens.push(token);
  return token;
}

// refresh access token
const refreshAccessToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token || !refreshTokens.includes(token)) return res.sendStatus(403);

  jwt.verify(token, envConfig.refresh_token_secret, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken(user);

    sendResponse(res,
      {
        statusCode: 200,
        success: true,
        message: "Access token refreshed successfully",
        data: { accessToken }
      }
    );
  })
}

const userSignUpService = async (userDetails) => {

  const existingUser = await User.findOne({ email: userDetails.email });

  if (existingUser) {
    throw new ApiError("User with this email ID already exists")
  }
  // const hashedPassword = await bcrypt.hash(userDetails.password, 12);

  const newUser = await User.create({ uid: () => randomUUID(), ...userDetails });

  return newUser;
};

/**
 * Handles user login logic.
 *
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object|null>} An object containing access and refresh tokens if login is successful, or null otherwise.
 */
const userLoginService = async (requestBody) => {
  const user = await User.findOne({ email: requestBody.email });

  if (!user) {
    throw new ApiError("User not found")
  }

  // const isPasswordMatch = bcrypt.compare(password, user.password);

  // if (!isPasswordMatch) {
  //   return null; // Password doesn't match
  // }

  return user;
};

const googleLoginService = async (requestBody) => {
  console.log(requestBody);

  const ticket = await client.verifyIdToken({
    idToken: requestBody.idToken,
    audience: envConfig.google_client_id
  })



  const payload = ticket.getPayload();

  const existingUser = await User.findOne({email: payload.email});

  if(!existingUser){

  }

  console.log("payload-- ",payload);

}

const forgotPasswordService = async (email) => {
  const otp = String(Math.floor(1000 + Math.random() * 9000));
  // console.log("email in service: ", email);

  const foundedUser = await User.findOne({ email });

  if (!foundedUser) {
    throw new ApiError("User with this email id not found.")
  }

  await redisClient.setEx(`otp:${email}`, 300, otp)


  let mailOptions = {
    from: `"SkillSwap Support" <${envConfig.sender_email}>`,
    to: email,
    subject: 'Password Reset',
    text: `The otp is - ${otp}`
  }

  await transporter.sendMail(mailOptions);

  // console.log(info)
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      // console.log(mailOptions);

      if (error) { return reject(new ApiError("Error occurred while sending an email")) }
      resolve(info)

    })
  })

  return otp;
}

// { otpInput, email } = req.body;
const verifyOtpService = async (requestBody) => {

  const storedOtp = await redisClient.get(`otp:${requestBody.email}`)

  if (requestBody.otpInput !== storedOtp.toString()) {
    throw new ApiError("Invalid OTP.")
  }
  return true;
}


//  { email, oldPassword, newPassword, confirmPassword } = req.body;
const changePasswordService = async (requestBody) => {

  if (requestBody.newPassword !== requestBody.confirmPassword) {
    throw new ApiError("New Password and confirm password does not match")
  }

  const updatePassword = await User.findOneAndUpdate({ email },
    {
      $set: {
        password: newPassword
      }
    },
    {
      new: true
    })

  // console.log("password updated-- ", updatePassword);


  return updatePassword;
}

export default {
  generateAccessToken,
  generateRefreshToken,
  refreshAccessToken,
  userSignUpService,
  userLoginService,
  googleLoginService,
  forgotPasswordService,
  verifyOtpService,
  changePasswordService
}