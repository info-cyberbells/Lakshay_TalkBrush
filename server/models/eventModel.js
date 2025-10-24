import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({

    fullName : { 
        type: String, 
        required: true
    },
    description: {
    type: String,
    default: '',
    required: true,
  },
   date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default: '',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

}, {timestamps: true});

const Event = mongoose.model("Event", eventSchema);
export default Event;