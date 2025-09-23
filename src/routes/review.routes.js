import express from "express";
const router = express.Router();
import reviewController from "../controllers/review.controller.js";
import authenticateToken from "../middlewares/authenticateToken.middleware.js";

router.route("/:id")
.get(authenticateToken, reviewController.getOneReviewController)
.post(authenticateToken,reviewController.addReviewController)
.patch(authenticateToken, reviewController.editReviewController)
.delete(authenticateToken, reviewController.deleteReviewController);

router.get("/all",authenticateToken,reviewController.getAllReviewsController);

export default router;