import catchAsync from "../middlewares/catchAsync.js"
import messageService from "../services/message.service.js";
import sendResponse from "../responses/sendResponse.js";
import ApiError from "../errors/ApiError.js";

const sendMessageController = catchAsync(async (req, res) => {
    const requestBody = req.body;
    const conversation_id = req.params.id;
    let sendingMessage;
    
    if (!conversation_id || !requestBody.sender_id) {
        throw new ApiError("Missing required fields: conversation_id or sender_id", 400);
    }

    if (req.file) {
        const requestFile = req.file;
        // console.log("req.file--> ", req.file);

        sendingMessage = await messageService.sendMessageService({ requestFile, requestBody, conversation_id });
    }
    else {
        sendingMessage = await messageService.sendMessageService({ requestBody, conversation_id });
    }

    if (!sendingMessage) {
        throw new ApiError("Cannot deliver the message. Please try again later.")
    }

    return sendResponse(res, {
        message: "message delivered successfully",
        data: sendingMessage,
        success: true
    })
});

const getMessageController = catchAsync(async (req, res) => {
    const message_id = req.params.id;

    const foundMessage = await messageService.getMessageService(message_id);

    return sendResponse(res, {
        message: "message found successfully",
        success: true,
        data: foundMessage
    })
});

const editMessageController = catchAsync(async () => { });

const deleteMessageController = catchAsync(async (req,res) => { 
    console.log("req.params.id: ",req.params.id);
    

    console.log(req.user.uid);

    const deleteMessage = await messageService.deleteMessageService({message_id:req.params.id, loggedInUserUid: req.user.uid});

    
});


export default {
    sendMessageController,
    getMessageController,
    editMessageController,
    deleteMessageController
}



