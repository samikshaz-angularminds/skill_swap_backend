import catchAsync from "../middlewares/catchAsync.js"
import connectionService from "../services/connections.service.js";
import sendResponse from "../responses/sendResponse.js";
import ApiError from "../errors/ApiError.js";

const sendConnectionRequest = catchAsync(async (req, res) => {
    const from = req.user.uid;
    const to = req.params.id

    const sentRequest = await connectionService.sendConnectionRequestService({ from, to })

    if (!sentRequest) {
        throw new ApiError("Could not send the connection request. Please try again later")
    }

    sendResponse(res, {
        message: "Request sent successfully",
        data: sentRequest,
        success: true
    });
})

const acceptConnectionRequest = catchAsync(async (req, res) => {
    const to = req.user.uid;
    const from = req.params.id;

    const acceptRequest = await connectionService.acceptConnectionRequestService({ to, from })
    console.log("accepting connection request...", acceptRequest);

    if (!acceptRequest) {
        throw new ApiError("No pending connection request found to accept");
    }

    return sendResponse(res, {
        data: acceptRequest,
        success: true,
        message: "Connection request accepted successfully"
    })
})

const rejectConnectionRequest = catchAsync(async (req, res) => {

    const to = req.user.uid;
    const from = req.params.id;

    const rejectRequest = await connectionService.rejectConnectionRequestService({ to, from });

    if (!rejectRequest) {
        throw new ApiError("No pending request found to reject.")
    }

    return sendResponse(res, {
        statusCode: 200,
        data: rejectRequest,
        success: true,
        message: "Connection request rejected successfully!"
    })

})

const cancelConnectionRequest = catchAsync(async (req, res) => {
    const from = req.user.uid;
    const to = req.params.id;

    const cancelRequest = await connectionService.cancelConnectionRequestService({ to, from });

    if (!cancelRequest) {
        throw new ApiError("No pending connection request found to cancel");
    }

    return sendResponse(res, {
        statusCode: 200,
        data: cancelRequest,
        success: true,
        message: "Connection request cancelled successfully"
    })
})

const showPendingRequest = catchAsync(async (req, res) => {

    const pendingRequests = await showPendingRequestService(req.user.uid);

    if (!pendingRequests || pendingRequests.length === 0) {
        throw new ApiError("Could not retrieve pending requests");
    }

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        data: pendingRequests,
        message: pendingRequests.length > 0 ? "Pending requests are found" : "No pending requests found"
    });

})

const showReceivedRequest = catchAsync(async (req, res) => {

    const receivedRequests = await showReceivedRequestService(req.user.uid);

    if (!receivedRequests) {
        throw new ApiError("Could not retrieve received requests");
    }

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        date: receivedRequests,
        message: receivedRequests.length > 0 ? "Received requests found" : "No pending requests found"
    });

})

const showAcceptedRequest = catchAsync(async (req, res) => {

    const acceptedRequests = await showAcceptedRequestService(req.user.uid);

    if (!acceptedRequests) {
        throw new ApiError("Could not retrieve accepted requests")
    }

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        date: acceptedRequests,
        message: acceptedRequests.length > 0 ? "Accepted requests found" : "No accepted requests found"
    });

})


export default {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    cancelConnectionRequest,
    showPendingRequest,
    showReceivedRequest,
    showAcceptedRequest
}
