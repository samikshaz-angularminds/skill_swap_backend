import express from "express";
import {
    updateUser,
    deleteUser,
    getUser,
    getAllUsers,
    updateProfileImage
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import authenticateToken from "../middlewares/autehenticateToken.middleware.js";
const router = express.Router();

// User routes
router.route("/:id")
.get(authenticateToken,getUser)
.put(authenticateToken, updateUser)
.delete(authenticateToken, deleteUser);


router.put("/update-profile-pic/:id", upload.single("avatar"),updateProfileImage)
router.put("/update-profile-info/:id",authenticateToken,updateUser)

router.get("/",authenticateToken,getAllUsers);


export default router;