const express = require("express");
const app = express();
const routes = require("./api/routes");
const cors = require('cors');
const fileUpload = require('express-fileupload');

app.use(fileUpload());
app.use(express.json());
app.use(cors())
//app.use(cors({
//    origin: 'https://inventorywebsitee.firebaseapp.com'
//  }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);

module.exports = app;
