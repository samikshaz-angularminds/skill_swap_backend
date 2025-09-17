import express from "express";
const router = express.Router();
import userController from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import authenticateToken from "../middlewares/authenticateToken.middleware.js";

// User routes
router.route("/me")
.get(authenticateToken,userController.getUserController)
.put(authenticateToken, userController.updateUserController)
.delete(authenticateToken, userController.deleteUserController);

router.get("/:id",authenticateToken,userController.getOneUserController)


router.put("/update-profile-pic/:id",authenticateToken, upload.single("avatar"),userController.updateProfileImageController)
router.patch("/update-availability/:id",authenticateToken,userController.updateAvailabilityController);

router.get("/",authenticateToken,userController.getAllUsersController);


export default router;