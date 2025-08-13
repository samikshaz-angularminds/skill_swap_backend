import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const connectionSchema = new Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    respondedAt: { type: Date }
});

const ConnectionRequest = model('ConnectionRequest',connectionSchema);

export default ConnectionRequest;