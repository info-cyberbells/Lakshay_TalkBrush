import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    actionType: { type: String, required: true }, // e.g. CREATE, UPDATE, DELETE
    description: { type: String },
    entityType: { type: String }, // which collection changed
    entityId: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Activity", activitySchema);
