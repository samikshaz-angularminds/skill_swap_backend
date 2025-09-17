import mongoose from "mongoose";
import catchAsync from "../middlewares/catchAsync.js";
import Post from "../models/post.temp.model.js";
import sendResponse from "../responses/sendResponse.js";

const createPostController = catchAsync(async (req, res) => {
    const requestBody = req.body;

    const newPost = await Post.create(requestBody);

    console.log("newPost-> ", newPost);

    return sendResponse(res, {
        message: "post added successfully",
        data: newPost,
        success: true
    })

})


const getPostsController = catchAsync(async (req, res) => {

    const limit = parseInt(req.query.limit) || 10;
    const cursor = req.query.cursor;

    let query = {};

    if (cursor) {

        const [createdAtStr, id] = cursor.split("_")
        const createdAt = new Date(createdAtStr.replace(" ","+"))

        console.log("createdAtStr-> ",createdAtStr);
        console.log("createdAt-> ",createdAt);
        
        const idObj = new mongoose.Types.ObjectId(id)
        
        query = {
            $or:[
                {created_at:{$gt:createdAt}},
                {created_at:createdAt,_id:{$gt:idObj}}
            ]
        }

    }

    const allPosts = await Post.find(query).limit(limit);

    return sendResponse(res, {
        message: "all posts retrieved successfully!",
        data: allPosts,
        success: true

    })
})


export default {
    createPostController, getPostsController
}