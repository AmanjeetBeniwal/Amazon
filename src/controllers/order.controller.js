// const Order = require("../models/order.model.js"); // Import your Order model
// const sendVerificationEmail = require("../middlewares/mail.config.js"); // Import your email function

// // Create Order
// const createOrder = async (req, res) => {
//   try {
//     console.log("Request body:", req.body);

//     const { items } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: "Items are required to create an order" });
//     }

//     // Calculate total amount
//     const TotalAmount = items.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );

//     // Create order details with user's ID from the request
//     const orderDetails = new Order({
//       userId: req.user._id, // Assuming `req.user` contains the authenticated user
//       items,
//       TotalAmount,
//     });

//     // Save order to database
//     await orderDetails.save();

//     // Send confirmation email
//     await sendVerificationEmail(
//       req.user.email, // Send email to the user's email
//       null, // Assuming the subject is handled in your email template
//       items,
//       "orderConfirmation"
//     );

//     // Respond with success message
//     return res.status(200).json({ message: "Order is created successfully" });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     return res.status(500).json({ message: "Error creating order", error });
//   }
// };

// // Get single order
// const getOrder = async (req, res) => {
//     console.log(req,"onfofoaknfofnqwekonkqn>>>>>>>>>>>>>>>>>>>>>>>>>>>>.",res);
    
//   try {
//     const order = await Order.findById(req.params.id); // Fetch order by ID from params
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     return res.status(200).json(order);
//   } catch (error) {
//     console.error("Error fetching order:", error);
//     return res.status(500).json({ message: "Error fetching order", error });
//   }
// };

// // Get all orders for a specific user
// const getUserOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ userId: req.user._id }); // Fetch all orders by user ID
//     if (orders.length === 0) {
//       return res.status(404).json({ message: "No orders found for this user" });
//     }

//     return res.status(200).json(orders);
//   } catch (error) {
//     console.error("Error fetching user orders:", error);
//     return res.status(500).json({ message: "Error fetching orders", error });
//   }
// };

// module.exports = {
//   createOrder,
//   getOrder,
//   getUserOrders,
// };
