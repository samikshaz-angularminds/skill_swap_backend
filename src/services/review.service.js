import ApiError from "../errors/ApiError.js";
import Review from "../models/review.model.js";
import User from "../models/user.model.js";
import httpStatus from "http-status";


const addReviewService = async ({ fromUserId, toUserId, requestBody }) => {

  const doesUserExist = await User.findOne({uid:toUserId});

  if(!doesUserExist){
    throw new ApiError(httpStatus.NOT_FOUND,"User with this ID does not exist")
  }

  const newReview = await Review.create({
    fromUserId, toUserId, ...requestBody
  });

  return newReview;

};

const editReviewService = async () => { };

const deleteReviewService = async () => { };

const getOneReviewService = async () => { };

const getAllReviewsService = async () => { };


export default {

  addReviewService,
  editReviewService,
  deleteReviewService,
  getOneReviewService,
  getAllReviewsService
}