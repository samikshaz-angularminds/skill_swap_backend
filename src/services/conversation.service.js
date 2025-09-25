import ApiError from "../errors/ApiError.js";
import Conversation from "../models/conversation.model.js";
import { randomUUID } from 'crypto'
import httpStatus from "http-status";


const createConversationService = async (requestBody) => {
    const participantIds = requestBody.participants.map(p => p.user_id);
    // console.log("participantIds-- ", participantIds);

    // Check if a conversation with the same participants already exists
    const existingConversation = await Conversation.findOne({
        "participants.user_id": { $all: participantIds },
        participants: { $size: participantIds.length }
    });

    // console.log("existingConversation-- ", existingConversation);

    if (existingConversation) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Conversation with these participants already exists");
    }

    const newConversation = await Conversation.create({ conversation_id: randomUUID(), ...requestBody });

    // console.log("newConversation-- ", newConversation);

    return newConversation;
}

const updateConversationService = async ({ conversation_id, requestBody }) => {     

    const updateConversation = await Conversation.findOneAndUpdate(
        { conversation_id },
        { ...requestBody },
        { new: true }
    );

    if(!updateConversation){
        throw new ApiError(httpStatus.NOT_FOUND,"Couldn't find the conversation or failed to update it.")
    }

    return updateConversation;
};

const getFullConversationService = async (conversation_id) => {

    const conversation = await Conversation.findOne({ conversation_id }).select("-_id");

    if (!conversation) {
        throw new ApiError(httpStatus.NOT_FOUND,"Cannot find the conversation with given id.")
    }

    return conversation;
};

const deleteConversationService = async (conversation_id) => {
    console.log("deleting conversation id: ",conversation_id);
    
    const conversation = await Conversation.findOneAndDelete({ conversation_id });

    if (!conversation) {
        throw new ApiError(httpStatus.NOT_FOUND,"Cannot find the conversation with given id.")
    }

    return true;
};

const getUserConversationsService  = async(user_id) => {
    const userConversation = await Conversation.find({
        "participants.user_id": user_id
    });
    return userConversation;
}

export default {
    createConversationService,
    updateConversationService,
    getFullConversationService,
    deleteConversationService,

    getUserConversationsService
}