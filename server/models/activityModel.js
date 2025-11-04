import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    actionType: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: {
        type: String,
        required: true,
        enum: ['notification', 'activity'],
        default: 'activity'
    },
    entityType: { type: String },
    entityId: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Activity", activitySchema);