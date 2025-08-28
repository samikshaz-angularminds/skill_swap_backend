import express from "express";
const router = express.Router();
import userController from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import authenticateToken from "../middlewares/autehenticateToken.middleware.js";

// User routes
router.route("/me/:id")
.get(authenticateToken,userController.getUser)
.put(authenticateToken, userController.updateUser)
.delete(authenticateToken, userController.deleteUser);

router.get("/:id",authenticateToken,userController.getOneUser)


router.put("/update-profile-pic/:id", upload.single("avatar"),userController.updateProfileImage)
router.put("/update-profile-info/:id",authenticateToken,userController.updateUser)

router.get("/",authenticateToken,userController.getAllUsers);


export default router;