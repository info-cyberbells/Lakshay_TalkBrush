import mongoose from "mongoose";
import Activity from "../models/activityModel.js";

const startWatcher = () => {
    const db = mongoose.connection;

    // const changeStream = db.watch([], { fullDocument: "updateLookup" });
    const changeStream = db.watch(
  [{ $match: { "ns.coll": { $in: ["users", "events"] } } }],
  { fullDocument: "updateLookup" }
);


    console.log("✅ MongoDB watcher started...");

    changeStream.on("change", async (change) => {
        if (!global.lastChangeId) global.lastChangeId = null;
if (global.lastChangeId === change._id._data) return;
global.lastChangeId = change._id._data;

        try {
            if (change.ns.coll === "activities") {
                return;
            }

            let actionType = "";
            let title = "";
            let description = "";
            let category = "";
            let metadata = {};
            const collectionName = change.ns.coll;
            const fullDocument = change.fullDocument;

            // Determine category based on collection
            // Events → notifications, Users → activities
            category = collectionName === "events" ? "notification" : "activity";

            switch (change.operationType) {
                case "insert":
                    actionType = "CREATE";

                    if (collectionName === "users") {
                        const userName = fullDocument?.name || fullDocument?.email || "Unknown User";
                        const userRole = fullDocument?.role || "user";

                        title = "New User Registered";
                        description = `${userName} has joined the platform`;
                        metadata = {
                            userName,
                            userEmail: fullDocument?.email,
                            userRole,
                            userId: fullDocument?._id,
                            icon: "user-plus"
                        };
                    } else if (collectionName === "events") {
                        const eventName = fullDocument?.title || fullDocument?.name || fullDocument?.fullName || "Unknown Event";
                        const eventDate = fullDocument?.date || fullDocument?.startDate;

                        title = "New Event Created";
                        description = `Event "${eventName}" has been added`;
                        metadata = {
                            eventName,
                            eventDate,
                            eventId: fullDocument?._id,
                            createdBy: fullDocument?.createdBy,
                            icon: "calendar-plus"
                        };
                    } else {
                        title = `New ${collectionName} Added`;
                        description = `A new ${collectionName} item has been created`;
                        metadata = { entityId: fullDocument?._id, icon: "plus" };
                    }
                    break;

                case "update":
                    actionType = "UPDATE";
                    const updatedFields = change.updateDescription?.updatedFields || {};
                    const fieldNames = Object.keys(updatedFields);

                    if (collectionName === "users") {
                        const userName = fullDocument?.name || fullDocument?.email || "Unknown User";
                        const userId = fullDocument?._id;

                        if (updatedFields?.lastLogin || updatedFields?.lastLoginAt) {
                            const userRole = fullDocument?.role || "user";
                            title = userRole === "admin" ? "Admin Login" : "User Login";
                            description = `${userName} logged into the system`;
                            metadata = {
                                userName,
                                userEmail: fullDocument?.email,
                                userRole,
                                userId,
                                loginTime: updatedFields.lastLogin || updatedFields.lastLoginAt || new Date(),
                                icon: "login"
                            };
                        } else if (updatedFields?.password || updatedFields?.passwordHash) {
                            title = "Password Changed";
                            description = `${userName} changed their password`;
                            metadata = { userName, userId, icon: "lock" };
                        } else if (updatedFields?.name || updatedFields?.email || updatedFields?.phone) {
                            title = "Profile Updated";
                            description = `${userName} updated their profile`;
                            metadata = {
                                userName,
                                userId,
                                updatedFields: fieldNames,
                                icon: "user-edit"
                            };
                        } else if (updatedFields?.role) {
                            title = "User Role Changed";
                            description = `${userName}'s role was changed to ${updatedFields.role}`;
                            metadata = {
                                userName,
                                userId,
                                newRole: updatedFields.role,
                                icon: "user-check"
                            };
                        } else {
                            title = "User Updated";
                            description = `${userName}'s information was updated`;
                            metadata = {
                                userName,
                                userId,
                                updatedFields: fieldNames,
                                icon: "user"
                            };
                        }
                    } else if (collectionName === "events") {
                        const eventName = fullDocument?.fullName || fullDocument?.name || "Unknown Event";
                        const eventId = fullDocument?._id;

                        title = "Event Updated";
                        description = `Event "${eventName}" was modified`;
                        metadata = {
                            eventName,
                            eventId,
                            updatedFields: fieldNames,
                            updatedBy: fullDocument?.updatedBy,
                            icon: "calendar-edit"
                        };
                    } else {
                        title = `${collectionName} Updated`;
                        description = `A ${collectionName} item was modified`;
                        metadata = { updatedFields: fieldNames, icon: "edit" };
                    }
                    break;

                case "delete":
                    actionType = "DELETE";

                    if (collectionName === "users") {
                        const deletedId = change.documentKey._id;
                        title = "User Deleted";
                        description = `A user account was permanently deleted`;
                        metadata = { deletedUserId: deletedId, icon: "user-minus" };
                    } else if (collectionName === "events") {
                        const deletedId = change.documentKey._id;
                        title = "Event Deleted";
                        description = `An event was removed from the system`;
                        metadata = { deletedEventId: deletedId, icon: "calendar-minus" };
                    } else {
                        title = `${collectionName} Deleted`;
                        description = `A ${collectionName} item was removed`;
                        metadata = { deletedId: change.documentKey._id, icon: "trash" };
                    }
                    break;

                default:
                    return;
            }

            // Create activity with category
            await Activity.create({
                actionType,
                title,
                description,
                category,
                entityType: collectionName,
                entityId: change.documentKey._id,
                metadata,
                // timestamp: new Date()
            });

            console.log(`📦 [${category.toUpperCase()}] ${title} - ${description}`);
        } catch (err) {
            console.error("❌ Activity log failed:", err.message);
        }
    });

    changeStream.on("error", (error) => {
        console.error("❌ Change stream error:", error);
    });

    changeStream.on("close", () => {
        console.log("⚠️ Change stream closed. Reconnecting...");
        setTimeout(startWatcher, 5000);
    });
};

export default startWatcher;