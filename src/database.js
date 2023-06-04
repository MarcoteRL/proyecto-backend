"use strict";

const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.DB_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));


module.exports = mongoose;
