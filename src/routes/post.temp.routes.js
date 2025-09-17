import express from "express";
const router = express.Router();
import postController from "../controllers/post.temp.controller.js"

router.route("/").post(postController.createPostController)
    .get(postController.getPostsController)


export default router;