import mongoose from "mongoose";
import Activity from "./models/activityModel.js";

const startWatcher = () => {
    const db = mongoose.connection;

    const changeStream = db.watch([], { fullDocument: "updateLookup" });

    console.log("✅ MongoDB watcher started...");

    changeStream.on("change", async (change) => {
        try {
            // ⚠️ IGNORE changes to the activities collection to prevent infinite loop
            if (change.ns.coll === "activities") {
                return;
            }

            let actionType = "";
            let description = "";
            const collectionName = change.ns.coll;
            const fullDocument = change.fullDocument;

            switch (change.operationType) {
                case "insert":
                    actionType = "CREATE";

                    // Customize description based on collection
                    if (collectionName === "users") {
                        const userName = fullDocument?.name || fullDocument?.email || "Unknown User";
                        description = `New user registered: ${userName}`;
                    } else if (collectionName === "events") {
                        const eventName = fullDocument?.title || fullDocument?.name || "Unknown Event";
                        description = `New event created: ${eventName}`;
                    } else {
                        description = `New ${collectionName} created`;
                    }
                    break;

                case "update":
                    actionType = "UPDATE";

                    // Customize description based on collection and updated fields
                    if (collectionName === "users") {
                        const updatedFields = change.updateDescription?.updatedFields;

                        // Check specific fields to determine action
                        if (updatedFields?.lastLogin) {
                            description = `User logged in: ${fullDocument?.name || fullDocument?.email || "Unknown User"}`;
                        } else if (updatedFields?.password) {
                            description = `User password changed: ${fullDocument?.name || fullDocument?.email || "Unknown User"}`;
                        } else if (updatedFields?.name || updatedFields?.email || updatedFields?.phone) {
                            description = `User profile updated: ${fullDocument?.name || fullDocument?.email || "Unknown User"}`;
                        } else {
                            description = `User information updated: ${fullDocument?.name || fullDocument?.email || "Unknown User"}`;
                        }
                    } else if (collectionName === "events") {
                        const eventName = fullDocument?.title || fullDocument?.name || "Unknown Event";
                        description = `Event updated: ${eventName}`;
                    } else {
                        description = `${collectionName} updated`;
                    }
                    break;

                case "delete":
                    actionType = "DELETE";

                    if (collectionName === "users") {
                        description = `User account deleted`;
                    } else if (collectionName === "events") {
                        description = `Event deleted`;
                    } else {
                        description = `${collectionName} deleted`;
                    }
                    break;

                default:
                    return;
            }

            await Activity.create({
                actionType,
                description,
                entityType: collectionName,
                entityId: change.documentKey._id,
            });

            console.log("📦 Logged activity:", description);
        } catch (err) {
            console.error("❌ Activity log failed:", err.message);
        }
    });
};

export default startWatcher;