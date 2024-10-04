const Cart = require("../models/cart.model.js");

// Create a new cart
const createCart = async (req, res) => {
  const UserId = req.user._id;
  console.log({ id: UserId });

  try {
    const cart = await Cart.create({ user_id: UserId });
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a cart by user_id
const getCartByUserId = async (req, res) => {
  const UserId = req.user._id;
  console.log({ id: UserId });
  try {
    const cart = await Cart.findOne({ user_id: UserId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    if (cart.Item && cart.Item.length > 0) {
      return res.status(200).json(cart);
    } else {
      return res.status(200).json({ message: "Cart is empty" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add an item to the cart
const addItemToCart = async (req, res) => {
  const { product_id, ItemQuantity } = req.body;
  // console.log(req.body);
// console.log(typeof(req.body.ItemQuantity));


  const UserId = req.user._id;
  // console.log(UserId);

  try {
    let cart = await Cart.findOne({ user_id: UserId });
    // console.log(cart);    
    if (!cart) {
      cart = new Cart({ user_id: UserId, Item: [{ product_id, ItemQuantity }] });
      await cart.save();
    } else {
      const itemExists = cart.Item.find(
        (item) => item.product_id === product_id
      );

      if (itemExists) {
        itemExists.ItemQuantity += Number(ItemQuantity); // Update quantity
      } else {
        cart.Item.push({ product_id, ItemQuantity }); // Add new item
      }
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update item quantity in the cart
const updateItemQuantity = async (req, res) => {
  const { product_id, ItemQuantity } = req.body;
  const UserId = req.user._id;
  try {
    const cart = await Cart.findOneAndUpdate(
      { user_id:UserId, "Item.product_id": product_id },
      { "Item.$.ItemQuantity": ItemQuantity },
      { new: true }
    );
    if (!cart)
      return res.status(404).json({ message: "Cart or item not found" });
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remove an item from the cart
const removeItemFromCart = async (req, res) => {
  const { product_id } = req.body;
  const UserId = req.user._id;
  try {
    const cart = await Cart.findOneAndUpdate(
      { UserId },
      { $pull: { Item: { product_id } } },
      { new: true }
    );
    if (!cart)
      return res.status(404).json({ message: "Cart or item not found" });
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete the entire cart
const deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ user_id: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createCart,
  deleteCart,
  getCartByUserId,
  removeItemFromCart,
  updateItemQuantity,
  addItemToCart,
};
