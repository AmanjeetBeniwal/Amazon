const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const Product = require("../models/product.model.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

// Create a new product
// const createProduct = async (req, res) => {
//   try {
//     const { Name, description, category, price, stock } = req.body;
//     console.log(req.body);
//     console.log(req.files);

//     // Ensure Image and video fields are accessed correctly
//     const imageFiles = req.files.Image;
//     const videoFile = req.files.video;

//     if (!imageFiles || imageFiles.length === 0) {
//       return res.status(400).json({ message: "No image file uploaded" });
//     }

//     const imageUploads = await Promise.all(
//       imageFiles.map((file) => uploadOnCloudinary(file.path))
//     );

//     const videoUpload = await uploadOnCloudinary(videoFile[0].path);

//     console.log(videoUpload.secure_url);

//     const product = await Product.create({
//       Name,
//       Image: imageUploads.map((img) => img.secure_url), // Store all image URLs
//       video: videoUpload ? videoUpload.secure_url : null,
//       description,
//       category,
//       price,
//       stock,
//     });

//     if (!product) {
//       return res.status(400).json({ message: "Product not created" });
//     } else {
//       res
//         .status(201)
//         .json({ message: "Product created successfully", product });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
const createProduct = async (req, res) => {
  try {
    const { Name, description, category, price, stock } = req.body;

    // Validate required fields
    if (!Name || !description || !category || !price || !stock) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // console.log(req.body);
    // console.log(req.files);

    const imageFiles = req.files.Image;
    const videoFile = req.files.video;

    if (!imageFiles || imageFiles.length === 0) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    // Upload images
    const imageUploads = await Promise.all(
      imageFiles.map((file) => uploadOnCloudinary(file.path))
    );

    // Upload video if it exists
    let videoUpload = null;
    if (videoFile && videoFile.length > 0) {
      videoUpload = await uploadOnCloudinary(videoFile[0].path);
    }

    // Create product with image and video URLs
    const product = await Product.create({
      Name,
      Image: imageUploads.map(img=>img.secure_url),
      video: videoUpload ? videoUpload.secure_url : null, // Include video URL
      description,
      category,
      price,
      stock,
    });

    if (!product) {
      return res.status(400).json({ message: "Product not created" });
    }
    
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Update product (only by Admin)
const UpdateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updates = req.body;

    // Handle image upload if provided
    if (req.files?.Image) {
      const imageFiles = req.files.Image;
      const imageUploads = await Promise.all(
        imageFiles.map((file) => uploadOnCloudinary(file.path))
      );
      updates.Image = imageUploads.map((img) => img.secure_url); // Update image URLs
    }

    // Handle video upload if provided
    if (req.files?.video) {
      const videoFiles = req.files.video;
      const videoUpload = await uploadOnCloudinary(videoFiles[0].path);
      updates.video = videoUpload.secure_url; // Update video URL
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "No updates made" });
    } else {
      return res
        .status(200)
        .json({ message: "Product updated successfully", updatedProduct });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Delete product by Admin
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId; // Ensure correct parameter usage
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    } else {
      return res.status(200).json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all products (accessible by users and admins)
const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    } else {
      return res.status(200).json({ message: "All products found", products });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createProduct, UpdateProduct, deleteProduct, getAllProduct };
