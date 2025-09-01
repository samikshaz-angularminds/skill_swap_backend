import ApiError from "../errors/ApiError.js";
import { randomUUID } from 'crypto';
import Message from "../models/message.model.js";
import { uploadImageMessage } from "../utils/uploadImageUtil.js";

const sendMessageService = async ({ requestFile, requestBody, conversation_id }) => {
    // console.log("requestFile: ",requestFile);
    // console.log("requestBody: ",requestBody);

    let sendingMessage;

    if (requestFile) {
        console.log("request file== ", requestFile);
        let type = "";

        if (requestFile.mimetype.startsWith("image")) {
            if(requestFile.mimetype === "image/webp") type = "sticker"
            else type = "image"
        }
        else if(requestFile,mimetype.startsWith("audio")){
            if(requestFile.mimetype === "audio/ogg") type = "voice_note"
            else type = "audio"
        }

        const uploadImage = await uploadImageMessage(requestFile.path);

        console.log("uploadImage }}}- ", uploadImage);


        sendingMessage = await Message.create({
            message_id: randomUUID(),
            conversation_id,

            metadata: {
                file_url: uploadImage.url,
                file_size: requestFile.size / (1024 * 1024),
                mime_type: requestFile.mimetype
            },
            ...requestBody
        })
    }
    else {
        sendingMessage = await Message.create({
            message_id: randomUUID(),
            conversation_id,
            ...requestBody
        })
    }

    return sendingMessage;
};

const getMessageService = async () => { };

const editMessageService = async () => { };

const deleteMessageService = async () => { };

export default {
    sendMessageService,
    getMessageService,
    editMessageService,
    deleteMessageService
}