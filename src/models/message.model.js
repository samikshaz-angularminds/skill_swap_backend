import mongoose from "mongoose";
const {Schema,model} = mongoose;

const ReactionSchema = new Schema({
  user_id: { type: String, required: true },   // could be ObjectId ref: "User"
  reaction: { type: String, required: true },  // e.g. 👍 ❤️ 😂
  reacted_at: { type: Date, default: Date.now }
}, { _id: false });

const MetadataSchema = new Schema({
  file_url: { type: String, default: null },
  file_size: { type: Number, default: null },
  mime_type: { type: String, default: null },
  duration: { type: Number, default: null },       // for audio/video
  thumbnail_url: { type: String, default: null },  // preview for images/videos
  location: { type: String, default: null }        // could be lat,long as "12.34,56.78"
}, { _id: false });

const MessageSchema = new Schema({
  message_id: { type: String, required: true, unique: true }, // or just use _id
  conversation_id: { type: String, required: true },          // could be ObjectId ref: "Conversation"
  sender_id: { type: String, required: true },                // could be ObjectId ref: "User"

  type: { 
    type: String, 
    enum: ["text", "image", "video", "audio", "file", "sticker", "voice_note", "location", "contact_card"], 
    default: "text" 
  },
  content: { type: String, default: null },

  metadata: { type: MetadataSchema, default: () => ({}) },

  status: { 
    type: String, 
    enum: ["pending", "sent", "delivered", "read", "failed"], 
    default: "sent" 
  },

  sent_at: { type: Date, default: Date.now },
  delivered_at: { type: Date, default: null },
  read_at: { type: Date, default: null },

  is_edited: { type: Boolean, default: false },
  edited_at: { type: Date, default: null },
  is_deleted: { type: Boolean, default: false },

  reply_to: { type: String, default: null },          // could ref another message_id
  forwarded_from: { type: String, default: null },    // could ref another message_id

  reactions: { type: [ReactionSchema], default: [] }
});

const Message = model("Message", MessageSchema);

export default Message;
