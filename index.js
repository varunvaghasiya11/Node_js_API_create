require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./config/db");
db();

const PORT = process.env.PORT || 3000;
const routes = require("./routes");
const bcrypt = require("bcrypt");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


