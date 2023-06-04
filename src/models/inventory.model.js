"use strict";
const { Schema, model } = require("mongoose");

const inventoryModel = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0.0
    },
    image: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false
}
);

module.exports = model("proyecto", inventoryModel);