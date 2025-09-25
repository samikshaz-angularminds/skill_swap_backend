import reviewService from "../services/review.service.js";
import catchAsync from "../middlewares/catchAsync.js";


const addReviewController = catchAsync(async (req, res) => {
    const fromUserId = req.user.uid ;
    const toUserId = req.params.id;
    const requestBody = req.body;

    console.log("from user id- ",fromUserId);

    const addedReview = await reviewService.addReviewService({fromUserId,toUserId,requestBody})
});

const editReviewController = catchAsync(async (req, res) => { });

const deleteReviewController = catchAsync(async (req, res) => { });

const getOneReviewController = catchAsync(async (req, res) => { });

const getAllReviewsController = catchAsync(async (req, res) => { });


export default{

    addReviewController,
    editReviewController,
    deleteReviewController,
    getOneReviewController,
    getAllReviewsController
}