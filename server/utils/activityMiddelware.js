import Activity from "../models/activityModel.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import Event from "../models/eventModel.js";

export const activityMiddleware = async (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    try {
      const method = req.method;
      const path = req.originalUrl;
      const status = res.statusCode;
      const body = req.body || {};

      // SKIP unused/unwanted requests
      if (method === "OPTIONS") return;
      if (![200, 201].includes(status)) return;
      if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) return;
      if (path.includes("/activities")) return; // avoid infinite loop

      // Identify entity: users / events
      let entityType = null;
      if (path.includes("/users")) entityType = "users";
      if (path.includes("/event") || path.includes("/events"))
        entityType = "events";
      if (!entityType) return;

      // Detect Action type
      let actionType =
        method === "POST"
          ? "insert"
          : method === "PUT" || method === "PATCH"
          ? "update"
          : "delete";

      // Decode logged-in user from JWT cookie
      let actor = null;
      let actorName = "Unknown User";
      let actorId = null;

      if (req.cookies?.authToken) {
        try {
          const decoded = jwt.verify(
            req.cookies.authToken,
            process.env.JWT_SECRET
          );
          actor = await User.findById(decoded.id).select("fullName email role");
          if (actor) {
            actorName = actor.fullName || actor.email;
            actorId = actor._id;
          }
        } catch (err) {}
      }

      let title = "";
      let description = "";
      let metadata = {};
      let category = entityType === "events" ? "notification" : "activity";

      // Find entity ID (user or event)
      let entityId = req.params.id || body._id || body.id || actorId;

      if (entityType === "users") {
        if (path.includes("/login")) {
          const loginEmail = body.email;

          const loggedUser = await User.findOne({ email: loginEmail }).select(
            "fullName email"
          );

          const loginName = loggedUser?.fullName || loggedUser?.email || "User";

          title = "User Login";
          description = `${loginName} logged into the system`;
          metadata = {
            loginTime: new Date(),
            icon: "login",
            email: loginEmail,
          };

          await Activity.create({
            actionType: "LOGIN",
            title,
            description,
            category: "activity",
            entityType: "users",
            entityId: loggedUser?._id,
            metadata,
            actor: {
              id: loggedUser?._id,
              name: loginName,
              role: loggedUser?.role,
            },
            duration: Date.now() - start,
          });

          console.log(`📦 [ACTIVITY] ${title} → ${description}`);

          return;
        } else if (

        /* ------------ SIGNUP (POST request) ------------ */
          (path.includes("/signup") || path.includes("/register")) &&
          actionType === "insert"
        ) {
          const signupEmail = body.email;

          // fetch user using email instead of id
          const newUser = signupEmail
            ? await User.findOne({ email: signupEmail }).select(
                "fullName email"
              )
            : null;

          const signupName = newUser?.fullName || newUser?.email || "New User";

          title = "New User Registered";
          description = `${signupName} has joined the platform`;
          metadata = {
            userName: newUser?.fullName,
            userEmail: newUser?.email,
            icon: "user-plus",
          };
        } else if (actionType === "update") {

        /* ------------ UPDATE (profile, password) ------------ */
          const updatedFields = Object.keys(body);

          // PASSWORD CHANGE
          if (updatedFields.includes("password")) {
            title = "Password Changed";
            description = `${actorName} changed their password`;
            metadata = {
              icon: "lock",
              updatedFields,
            };
          }

          // PROFILE UPDATE (name, email, phone, etc.)
          else if (
            updatedFields.some((f) =>
              [
                "email",
                "fullName",
                "phoneNumber",
                "location",
                "type",
                "image",
              ].includes(f)
            )
          ) {
            title = "Profile Updated";
            description = `${actorName} updated their profile`;
            metadata = {
              icon: "user-edit",
              updatedFields,
            };
          }

          // LAST LOGIN UPDATE (if backend updates lastLogin field)
          else if (updatedFields.includes("lastLogin")) {
            title = "User Login";
            description = `${actorName} has logged in`;
            metadata = {
              loginTime: body.lastLogin,
              icon: "login",
              updatedFields,
            };
          }

          // OTHER CHANGES
          else {
            title = "User Updated";
            description = `${actorName}'s information was updated`;
            metadata = {
              icon: "user",
              updatedFields,
            };
          }
        } else if (actionType === "delete") {

        /* ------------ DELETE ------------ */
          title = "User Deleted";
          description = `A user account was deleted`;
          metadata = { deletedUserId: entityId, icon: "user-minus" };
        }
      }

      if (entityType === "events") {
        // Fetch event for name reference
        let eventDoc = null;
        if (entityId) {
          eventDoc = await Event.findById(entityId).select("fullName");
        }

        const eventName =
          body.fullName || eventDoc?.fullName || "Unknown Event";

        // CREATE EVENT
        if (actionType === "insert") {
          title = "New Event Created";
          description = `Event "${eventName}" has been added`;
          metadata = { eventName, icon: "calendar-plus" };
        }

        // UPDATE EVENT
        if (actionType === "update") {
          const updatedFields = Object.keys(body);
          title = "Event Updated";
          description = `Event "${eventName}" was modified`;
          metadata = {
            eventName,
            updatedFields,
            icon: "calendar-edit",
          };
        }

        // DELETE EVENT
        if (actionType === "delete") {
          title = "Event Deleted";
          description = `Event "${eventName}" was removed`;
          metadata = { deletedEventId: entityId, icon: "calendar-minus" };
        }
      }

      if (title) {
        await Activity.create({
          actionType: actionType.toUpperCase(),
          title,
          description,
          category,
          entityType,
          entityId,
          metadata,
          actor: {
            id: actorId,
            name: actorName,
            role: actor?.role,
          },
          duration: Date.now() - start,
        });

        console.log(`📦 [${category.toUpperCase()}] ${title} → ${description}`);
      }
    } catch (err) {
      console.error("❌ Activity Middleware Error:", err.message);
    }
  });

  next();
};
