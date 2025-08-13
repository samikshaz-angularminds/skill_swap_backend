import express from "express";
import connectionController from "../controllers/connections.controller.js";
import authenticateToken from "../middlewares/autehenticateToken.middleware.js";
const router = express.Router();

router.post("/:id/request", authenticateToken, connectionController.sendConnectionRequest)
router.post("/:id/accept", authenticateToken, connectionController.acceptConnectionRequest)
router.post("/:id/reject", authenticateToken, connectionController.rejectConnectionRequest)
router.post("/:id/cancel", authenticateToken, connectionController.cancelConnectionRequest)

router.get("/me/pending", authenticateToken, connectionController.showPendingRequest)
router.get("/me/received", authenticateToken, connectionController.showReceivedRequest)
router.get("/me/all", authenticateToken, connectionController.showAcceptedRequest)



export default router