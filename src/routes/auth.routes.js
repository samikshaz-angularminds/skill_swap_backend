import authController from "../controllers/auth.controller.js"

import express from "express";
const router = express.Router();


// Auth routes
router.post("/signup", authController.userSignUp);
router.post("/login", authController.userLogin);
router.get('/logout', authController.userLogout)



router.post("/google", authController.googleLogin)

router.post("/forgot-password", authController.forgotPassword)
router.post("/verify-otp", authController.verifyOtpPassword)
router.put("/change-password", authController.changePassword)

export default router;