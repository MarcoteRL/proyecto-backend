"use strict";

const app = require('./app');
require('./database');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));