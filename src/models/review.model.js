import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ReviewSchema = new Schema({
    toUserId: { type: String, required: true },
    fromUserId: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5},
    comment: String,
    date: { type: Date, default: Date.now }
});

const Review = model("Review", ReviewSchema);

export default Review;