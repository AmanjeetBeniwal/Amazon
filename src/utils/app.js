const express = require("express");
const app = express();
const registerUser = require("../routes/user.routes.js");
const createProduct = require("../routes/product.routes.js");
// const orderRoute = require("../routes/order.routes.js");
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "115kb" }));
app.use(express.static("public"));
// register new user
app.use("/API/V1/users", registerUser);
app.use("/API/V1/products", createProduct);

// app.use("/API/V1/order", orderRoute);
module.exports = app;
