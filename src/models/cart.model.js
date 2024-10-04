const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    Item: [
      {
        product_id: {
          type: String,
          required: true,
        },
        ItemQuantity: {
          type: Number, 
          required: true,
        },
      },
    ],
  }, 
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema); 

module.exports = Cart; 
