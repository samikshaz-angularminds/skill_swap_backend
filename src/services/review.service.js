import ApiError from "../errors/ApiError.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import httpStatus from "http-status";


const addReviewService = async ({ fromUserId, toUserId, requestBody }) => {

  const doesUserExist = await User.findOne({ uid: toUserId });

  if (!doesUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User with this ID does not exist")
  }

  const existingReview = await Review.findOne({ fromUserId, toUserId });

  if (existingReview) {
    throw new ApiError(httpStatus[409], 'Review already exists')
  }

  const newReview = await Review.create({
    fromUserId, toUserId, ...requestBody
  });

  return newReview;

};

const editReviewService = async ({ fromUserId, toUserId, requestBody }) => {



  const updatedReview = await Review.findOneAndUpdate({ fromUserId, toUserId }, { ...requestBody }, { new: true });

  if (!updatedReview) {
    throw new ApiError(httpStatus[400], 'Failed to update the review');
  }

  return updatedReview;
};

const deleteReviewService = async ({ fromUserId, toUserId }) => {

  const deletedReview = await Review.findOneAndDelete({ fromUserId, toUserId });

    if (!deletedReview) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  return deletedReview;

};

const getOneReviewService = async ({ fromUserId, toUserId }) => {
  const review = await Review.findOne({fromUserId,toUserId});

  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }

  return review
 };

const getAllReviewsService = async ({toUserId},{ limit = 50, skip = 0 } = {}) => {
  const allReviews = await Review.find({ toUserId })
    .sort({ date: -1 }) // newest first
    .skip(skip)
    .limit(limit)
    .lean();

  
  return allReviews
 };


export default {

  addReviewService,
  editReviewService,
  deleteReviewService,
  getOneReviewService,
  getAllReviewsService
}