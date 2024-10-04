const express = require("express");
const app = express();
const registerUser = require("../routes/user.router");
const createProduct = require("..//routes/product.router.js");
const createCart = require("../routes/cart.route.js");
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "115kb" }));
app.use(express.static("public"));
// register new user
app.use("/API/V1/users", registerUser);
app.use("/API/V1/products", createProduct);
app.use("/API/V1/carts", createCart);
app.use("API/V1/order")
module.exports = app;
