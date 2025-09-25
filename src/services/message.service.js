import ApiError from "../errors/ApiError.js";
import { randomUUID } from 'crypto';
import Message from "../models/message.model.js";
import conversationService from "./conversation.service.js"
import { uploadAudioUtil, uploadImageMessage, uploadVideoUtil } from "../utils/uploadFileUtil.js";
import httpStatus from "http-status";

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

const sendMessageService = async ({ requestFile, requestBody, conversation_id }) => {

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
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to upload image");
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
        throw new ApiError(httpStatus.NOT_FOUND, "Message not found");
    }

    return foundMessage;
};

const editMessageService = async ({ message_id, loggedInUserUid, requestBody }) => {
    const message = await getMessageService(message_id);

    if (message.type !== "text") {
        throw new ApiError(httpStatus.BAD_REQUEST, "Only text messages can be edited");
    }

    if (message.sender_id !== loggedInUserUid) {
        throw new ApiError(403, "You are not authorized to edit this message");
    }

    const editedMessage = await Message.findOneAndUpdate(
        { message_id },
        {
            content: requestBody,
            is_edited: true,
            edited_at: new Date()
        },
        { new: true }
    );

    return editedMessage;

};

const messageReactionsService = async ({ message_id,user_id, requestBody }) => {

    const message = await getMessageService(message_id);

    const existingReactionIndex = message.reactions.findIndex(
        reaction => reaction.user_id === user_id
    );

    const addReaction = await Message.findOneAndUpdate(
        { message_id },
        existingReactionIndex >=0 ? {
            $set:{
                "reactions.$[elem].reaction": requestBody.reaction,
                "reactions.$[elem].reacted_at": new Date(),
            },
        } : {
            $push: {
                reactions: {
                    user_id,
                    reaction: requestBody.reaction,
                    reacted_at: new Date()
                }
            },
        },
        {
            arrayFilters: existingReactionIndex >= 0 ? [{"elem.user_id": user_id}] :undefined,
            new: true
        }
    );

    return addReaction;
};

const messageDeliveryService = async (requestBody) => { };

const messageReadService = async ({ message_id, requestBody }) => {


};

const deleteMessageService = async ({ message_id, loggedInUserUid }) => {

    const message = await getMessageService(message_id);

    const participants = (await conversationService.getFullConversationService(message.conversation_id)).participants;
    const isLoggedInUserAdmin = participants.some(
        participant => participant.user_id === loggedInUserUid && participant.role === "admin"
    );

    if (message.sender_id === loggedInUserUid || isLoggedInUserAdmin) {
        const deletedMessage = await Message.deleteOne({ message_id });

        if (!deletedMessage) {
            throw new ApiError(httpStatus.NOT_FOUND, "Message not found or already deleted");
        }
        console.log(deletedMessage);
        return deletedMessage;
    } else {
        throw new ApiError(403, "You are not authorized to delete this message");
    }

    return;

};



export default {
    sendMessageService,
    getMessageService,
    editMessageService,
    messageReactionsService,
    messageDeliveryService,
    messageReadService,
    deleteMessageService
}