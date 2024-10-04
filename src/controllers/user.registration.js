const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendVerificationEmail } = require("../middlewares/mail.config.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, phone, address, role } = req.body;
  console.log(req.body);
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const photoLocalPath = req.file.path; //'./src/images/uCPY1x.jpg'

  if (!photoLocalPath) {
    return res.status(404).json({ message: "localPath is not found " });
  }
  const image = await uploadOnCloudinary(photoLocalPath);
  console.log(image.secure_urle);

  const user = await User.create({
    name,
    email,
    password,
    phone,
    address,
    verificationCode,
    role,
    photo: image.secure_url,
  });

  if (user) {
    const token = jwt.sign(
      { id: user._id, isVerified: user.isVerified },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    try {
      await sendVerificationEmail(user.email, verificationCode, true); // true = verification email
      res.status(201).json({
        message: "User registered. Check your email to verify your account.",
        token,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to send verification email", error });
    }
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetToken = resetToken;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour expiration
  await user.save();

  await sendVerificationEmail(user.email, resetToken, false);
  return res.status(200).json({ message: "Password reset email sent" });
};

// Reset password
const resetPassword = async (req, res) => {
  const token = req.params.token;
  const { email } = req.body;
  console.log(token);
  const { newPassword } = req.body;
  // console.log(req.body);

  // Check if the token is provided
  if (!token) {
    return res.status(400).json({ message: "Please provide a token" });
  }

  // Find the user with the given reset token and check if the token is still valid
  const user = await User.findOne({
    email: email,
  });
  console.log(user);

  // If the user is not found or the token is invalid
  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  try {
    // Validate the new password (add your own criteria)
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    // Check if the user has exceeded the maximum number of attempts (e.g., 3 attempts)
    if (user.verificationAttempts >= 3) {
      return res
        .status(400)
        .json({ message: "Maximum verification attempts exceeded" });
    }

    // Check if the verification code matches
    if (
      user.verificationCode !== token &&
      user.resetTokenExpiry >= Date.now()
    ) {
      // Increment the number of failed attempts
      user.verificationAttempts += 1;
      await user.save();

      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear the reset token and expiry
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    // Save the updated user information
    await user.save();

    // Respond with success message
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  const code = req.params.code;
  console.log(code);

  const user = req.user;
  console.log(user);

  if (!user) {
    return res
      .status(400)
      .json({ message: "Invalid or expired verification code" });
  }
  // Check if the user has exceeded the maximum number of attempts (e.g., 3 attempts)
  if (user.verificationAttempts >= 3) {
    return res
      .status(400)
      .json({ message: "Maximum verification attempts exceeded" });
  }

  // Check if the verification code matches
  if (user.verificationCode !== code) {
    // Increment the number of failed attempts
    user.verificationAttempts += 1;
    await user.save();

    return res.status(400).json({ message: "Invalid verification code" });
  }

  user.isVerified = true;
  user.verificationCode = null; // Clear the verification code
  user.verificationAttempts = 0;
  await user.save();

  res.status(200).json({ message: "Email successfully verified" });
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "20d",
    }
  );
  res.status(200).json({ message: "User logged in", token, role: user.role });
};

////// promoteUsertoAdmin
const promoteUserToAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body);

    const user = await User.findOne({ email: email });
    // console.log(user);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    user.role = "admin";
    user.save();
    res
      .status(200)
      .json({ message: "user role change sucessFully", role: user.role });
  } catch (error) {
    res.status(500).json({ message: "intetrnal server error", error });
  }
};
///getAll  user by  the admin only

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ message: "allUser", users });
  } catch (error) {
    res.status(500).json({ message: "server error ", error });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
const UpdateUser = async (req, res) => {
  const { name, phone, address } = req.body;
  const updateData = {};

  try {
    if (req.file) {
      const imageUpload = await uploadOnCloudinary(req.file.path);
      if (imageUpload && imageUpload.secure_url) {
        updateData.photo = imageUpload.secure_url; 
      } else {
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select("-password");
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Change password
const changPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Old password is incorrect" });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
};
//////////delete user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (user.role === "admin") {
      return res.status(451).json({ message: "Unavailable For Legal Reasons" });
    }
    const remove = await User.findByIdAndDelete(userId);

    if (!remove) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// Logout user
const logOut = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  registerUser,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  loginUser,
  promoteUserToAdmin,
  getUserProfile,
  UpdateUser,
  changPassword,
  logOut,
  getAllUser,
  deleteUser,
};
