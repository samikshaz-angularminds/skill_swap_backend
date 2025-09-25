import reviewService from "../services/review.service.js";
import catchAsync from "../middlewares/catchAsync.js";
import sendResponse from "../responses/sendResponse.js";
import httpStatus from 'http-status';


const addReviewController = catchAsync(async (req, res) => {
    const fromUserId = req.user.uid;
    const toUserId = req.params.id;
    const requestBody = req.body;

    const addedReview = await reviewService.addReviewService({ fromUserId, toUserId, requestBody });

    return sendResponse(res, {
        statusCode: httpStatus.SUCCESS,
        success: true,
        message: "review added successfully",
        data: addedReview
    })
});

const editReviewController = catchAsync(async (req, res) => {
    const fromUserId = req.user.uid;
    const toUserId = req.params.id;
    const requestBody = req.body;

    const updatedReview = await reviewService.editReviewService({ fromUserId, toUserId, requestBody });

    return sendResponse(res, {
        statusCode: httpStatus.SUCCESS,
        success: true,
        message: "review updated successfully",
        data: updatedReview
    })
});


const deleteReviewController = catchAsync(async (req, res) => {
    const fromUserId = req.user.uid;
    const toUserId = req.params.id;

    const deletedReview = await reviewService.deleteReviewService({ fromUserId, toUserId });

    return sendResponse(res, {
        statusCode: httpStatus.SUCCESS,
        success: true,
        message: "review updated successfully",
        data: deletedReview
    })
});

const getOneReviewController = catchAsync(async (req, res) => {
    const fromUserId = req.user.uid;
    const toUserId = req.params.id;

    const oneReview = await reviewService.getOneReviewService({ fromUserId, toUserId });

    return sendResponse(res, {
        statusCode: httpStatus.SUCCESS,
        success: true,
        message: "review found successfully",
        data: oneReview
    });
});

const getAllReviewsController = catchAsync(async (req, res) => { 
    const toUserId = req.params.id;



    const allReviews = await reviewService.getAllReviewsService({ toUserId });
    
    return sendResponse(res, {
        statusCode: httpStatus.SUCCESS,
        success: true,
        message: "reviews found successfully",
        data: allReviews
    })
});


export default {

    addReviewController,
    editReviewController,
    deleteReviewController,
    getOneReviewController,
    getAllReviewsController
}