import express from "express";
import connectionController from "../controllers/connections.controller.js";
import authenticateToken from "../middlewares/authenticateToken.middleware.js";
const router = express.Router();

router.post("/:id/request", authenticateToken, connectionController.sendConnectionRequest)
router.put("/:id/accept", authenticateToken, connectionController.acceptConnectionRequest)
router.post("/:id/reject", authenticateToken, connectionController.rejectConnectionRequest)
router.post("/:id/cancel", authenticateToken, connectionController.cancelConnectionRequest)

router.get("/me/pending", authenticateToken, connectionController.showPendingRequest)
router.get("/me/received", authenticateToken, connectionController.showReceivedRequest)
router.get("/me/accepted", authenticateToken, connectionController.showAcceptedRequest)



export default router