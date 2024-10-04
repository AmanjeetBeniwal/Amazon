const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller"); // Adjust the path as necessary
const {protect} = require("../middlewares/aouth.js");
// Create a new cart
router.post("/carts", protect, cartController.createCart);

// Get a cart by user_id
router.get("/getCarts", protect,cartController.getCartByUserId);

// Add an item to the cart
router.post("/carts/add-item",protect, cartController.addItemToCart);

// Update item quantity in the cart
router.put("/carts/update-item", protect,cartController.updateItemQuantity);

// Remove an item from the cart
router.delete("/carts/remove-item",protect, cartController.removeItemFromCart);

// Delete the entire cart
router.delete("/carts/:user_id", protect,cartController.deleteCart);

module.exports = router;
