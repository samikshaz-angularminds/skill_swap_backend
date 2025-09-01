import catchAsync from "../middlewares/catchAsync.js"
import messageService from "../services/message.service.js";
import sendResponse from "../responses/sendResponse.js";
import ApiError from "../errors/ApiError.js";

const sendMessageController = catchAsync(async (req, res) => {
    const requestBody = req.body;
    const conversation_id = req.params.id;
    let sendingMessage;

    if (req.file) {
        const requestFile = req.file;

        sendingMessage = await messageService.sendMessageService({ requestFile, requestBody, conversation_id });
    }
    else {
        sendingMessage = await messageService.sendMessageService({ requestBody, conversation_id });
    }

    // console.log("message request=> ", requestBody);
    // console.log("conversation_id:- ", conversation_id);


    console.log("response: ",sendingMessage);
    


    return sendResponse(res, {
        message: "message delivered successfully",
        data: sendingMessage,
        success: true
    })
});

const getMessageController = catchAsync(async () => { });

const editMessageController = catchAsync(async () => { });

const deleteMessageController = catchAsync(async () => { });


export default {
    sendMessageController,
    getMessageController,
    editMessageController,
    deleteMessageController
}



