import ApiError from "../errors/ApiError.js";
import { randomUUID } from 'crypto';
import Message from "../models/message.model.js";
import { uploadAudioUtil, uploadImageMessage, uploadVideoUtil } from "../utils/uploadFileUtil.js";

const resolveMessageType = (mimetype) => {
    if (mimetype.startsWith("image")) {
        return mimetype === "image/webp" ? "sticker" : "image";
    }
    if (mimetype.startsWith("audio")) {
        return mimetype === "audio/ogg" ? "voice_note" : "audio";
    }
    if (mimetype.startsWith("video")) return "video";
    return "file"; // fallback
};

const sendMessageService = async ({ requestFile,requestBody, conversation_id }) => {

    let sendingMessage;

    if (requestFile) {
        let uploadFile;

        const type = resolveMessageType(requestFile.mimetype);

        if (type === "image" || type === "sticker") {
            uploadFile = await uploadImageMessage(requestFile.path);
        } else if (type === "audio" || type === "voice_note") {
            uploadFile = await uploadAudioUtil(requestFile.path);
        } else if (type === "video") {
            uploadFile = await uploadVideoUtil(requestFile.path);
        } else {
            uploadFile = await uploadFileUtil(requestFile.path);
        }

        try {

            sendingMessage = await Message.create({
                message_id: randomUUID(),
                conversation_id,
                type,
                metadata: {
                    file_url: uploadFile.url,
                    file_size: requestFile.size / (1024 * 1024),
                    mime_type: requestFile.mimetype
                },
                ...requestBody
            });
        } catch (error) {
            console.error("Error uploading image: ", error);
            throw new ApiError(500, "Failed to upload image");
        }
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

const getMessageService = async (message_id) => {
    const foundMessage = await Message.findOne({ message_id });

    if (!foundMessage) {
        throw new ApiError("Could not retrieve the message")
    }

    return foundMessage;
};

const editMessageService = async () => { };

const deleteMessageService = async ({message_id, loggedInUserUid}) => {
    const message = getMessageService(message_id);

if( message.sender_id){}
    const deletedMessage = await Message.deleteOne({message_id});

    console.log(deletedMessage);
    
 };

export default {
    sendMessageService,
    getMessageService,
    editMessageService,
    deleteMessageService
}