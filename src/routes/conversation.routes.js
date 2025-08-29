import conversationController from "../controllers/conversation.controller.js";
import authenticateToken from "../middlewares/authenticateToken.middleware.js";
import express from "express";
const router = express.Router();

router.post("/",authenticateToken,conversationController.createConversationController);

router.route("/:id")
.get(authenticateToken,conversationController.getFullConversationController)
.put(authenticateToken,conversationController.updateConversationController)
.delete(authenticateToken, conversationController.deleteConversationController)


router.route("/user/:id")
.get(authenticateToken,conversationController.getUserConversationsController)

export default router;