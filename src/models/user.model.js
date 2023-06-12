"use strict";
const { Schema, model } = require("mongoose");

const userModel = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true,
        default: 0
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model("User", userModel);