import mongoose from "mongoose";
const {Schema,model} = mongoose

const ParticipantSchema = new Schema({
  user_id: { type: String, required: true },     // could also be ObjectId ref -> User
  role: { type: String, enum: ["member", "admin", "owner"], default: "member" },
  joined_at: { type: Date, default: Date.now },
  last_read_message_id: { type: String, default: null }
}, { _id: false });

const LastMessageSchema = new Schema({
  message_id: { type: String },
  sender_id: { type: String },
  content_preview: { type: String },
  sent_at: { type: Date }
}, { _id: false });

const SettingsSchema = new Schema({
  muted: { type: Boolean, default: false },
  pinned: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  permissions: {
    can_add_members: { type: Boolean, default: true },
    can_send_media: { type: Boolean, default: true }
  }
}, { _id: false });

const ConversationSchema = new Schema({
  conversation_id: { type: String, required: true, unique: true }, // UID HERE
  type: { type: String, enum: ["direct", "group", "channel"], default: "direct" },

  participants: {
    type: [ParticipantSchema],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length >= 2;
      },
      message: "A conversation must have at least 2 participants."
    }
  },

  title: { type: String, default: null },
  description: { type: String, default: null },
  avatar_url: { type: String, default: null },

  last_message: { type: LastMessageSchema, default: null },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },

  settings: { type: SettingsSchema, default: () => ({}) }
});

const Conversation =  model("Conversation", ConversationSchema);

export default Conversation;
