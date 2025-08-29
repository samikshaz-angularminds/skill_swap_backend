import catchAsync from "../middlewares/catchAsync.js"
import conversationService from "../services/conversation.service.js";
import sendResponse from "../responses/sendResponse.js";
import ApiError from "../errors/ApiError.js";

const createConversationController = catchAsync(async (req, res) => {
    const requestBody = req.body;

    console.log("request body== " + JSON.stringify(req.body, null, 2));


    const newConversation = await conversationService.createConversationService(requestBody);

    // console.log("new conversation: "+newConversation);


    return sendResponse(res, {
        message: "new conversation created successfully",
        data: newConversation,
        success: true
    });


});

const updateConversationController = catchAsync(async (req, res) => { 
    const conversation_id = req.params.id;
    const requestBody = req.body;

    const updatedConversation = await conversationService.updateConversationService({conversation_id,requestBody});

    return sendResponse(res,{
        message:"conversation updated successfully.",
        data:updatedConversation,
        success:true
    })
});

const getFullConversationController = catchAsync(async (req, res) => {
    const conversation_id = req.params.id;

    const conversation = await conversationService.getFullConversationService(conversation_id);

    return sendResponse(res, {
        message: "conversation loaded successfully",
        success: true,
        data: conversation
    })
});

const deleteConversationController = catchAsync(async (req, res) => {
    const conversation_id = req.params.id;

    const deleteConversation = await conversationService.deleteConversationService(conversation_id);

    if (deleteConversation) {
        return sendResponse(res, {
            message: "conversation has been deleted successfully.",
            data: deleteConversation,
            success: true
        });
    }

    return sendResponse(res, {
        message: "failed to delete the conversation!",
        data: {},
        success: false
    });

})

const getUserConversationsController = catchAsync(async (req,res) => {
    const user_id = req.params.id;

    const userConversation = await conversationService.getUserConversationsService(user_id);

    return sendResponse(res,{
        message: "got the conversation.",
        data: userConversation,
        success: true
    })
})

export default {
    createConversationController,
    updateConversationController,
    getFullConversationController,
    deleteConversationController,

    getUserConversationsController
}