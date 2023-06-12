"use strict";
const { Schema, model } = require("mongoose");

const categoryModel = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model("Category", categoryModel);
