const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // MongoDB connection

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection (replace with your MongoDB URI)
const MONGO_URI = 'mongodb://localhost:27017/ecommerce'; // Update with your DB URI
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log('Error connecting to MongoDB:', err);
});

// Define Order schema and model
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      price: { type: Number, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  TotalAmount: { type: Number, required: true }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// Middleware
app.use(bodyParser.json());

// Mock email sending function
const sendVerificationEmail = async (email, subject, items, template) => {
  console.log(`Email sent to ${email} with template ${template}`);
  return Promise.resolve();
};

// Order creation route
app.post('/order', async (req, res) => {
  try {
    console.log("req.body::::", req.body);

    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items are required to create an order" });
    }

    const TotalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Assuming req.user is set via authentication middleware
    const userId = req?.user?._id || "UserId"; 

    // Create new order document
    const orderDetails = new Order({
      userId,
      items,
      TotalAmount,
    });

    // Save the order to MongoDB
    await orderDetails.save();

    // Mock sending email
    await sendVerificationEmail(
      req?.user?.email || "test@example.com", 
      null,
      items,
      "orderConfirmation"
    );

    return res.status(200).json({ message: "Order is created successfully" });
  } catch (error) {
    console.log("Error creating order:", error);
    return res.status(500).json({ message: "Error creating order", error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
