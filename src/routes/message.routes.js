import express from "express";
const router = express.Router();
import messageController from "../controllers/message.controller.js";
import authenticateToken from "../middlewares/authenticateToken.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

router.route("/:id")
.get(authenticateToken,messageController.getMessageController)
.post(authenticateToken,upload.single("message"),messageController.sendMessageController)
.delete(authenticateToken,messageController.deleteMessageController)

router.route("/:id/reactions")
.patch(authenticateToken,messageController.messageReactionsController)

router.route("/:id/delivery")
.patch(authenticateToken,messageController.messageDeliveryController)

router.route("/:id/read")
.patch(authenticateToken,messageController.messageReadController)

router.route("/:id/edit")
.patch(authenticateToken,messageController.editMessageController)


export default router;