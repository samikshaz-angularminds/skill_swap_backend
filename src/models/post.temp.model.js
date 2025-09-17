import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', postSchema);

export default Post
