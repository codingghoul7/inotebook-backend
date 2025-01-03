var mongoose = require("mongoose");
//import mongoose from 'mongoose';
const { Schema } = mongoose;

const notesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    title: {
        type: String,
        required: true,

    },
    des: {
        type: String,
        required: true,


    },
    tag: {
        type: String,
        required: true,
        default: "General"

    },
    date: {
        type: Date,
        default: Date.now

    }
});
module.exports = mongoose.model("notes", notesSchema);