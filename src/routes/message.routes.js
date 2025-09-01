import express from "express";
const router = express.Router();
import messageController from "../controllers/message.controller.js";
import authenticateToken from "../middlewares/authenticateToken.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

router.route("/:id")
.get(authenticateToken,messageController.getMessageController)
.post(authenticateToken,upload.single("message"),messageController.sendMessageController)
.put(authenticateToken,messageController.editMessageController)
.delete(authenticateToken,messageController.deleteMessageController)


export default router;