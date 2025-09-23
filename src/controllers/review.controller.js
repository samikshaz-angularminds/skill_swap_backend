
import reviewService from "../services/review.service";

const addReviewController = catchAsync(async (req, res) => {
    reviewerId = req.params.id;
    requestBody = req.body;

    if (reviewerId === req.user.uid) {
        throw new ApiError("Cannot add review for itself");
    }

    const addedReview = await reviewService.addReviewService(reviewerId)
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