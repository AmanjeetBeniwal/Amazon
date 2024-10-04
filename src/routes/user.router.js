const express = require("express");
const {
  registerUser,
  getUserProfile,
  loginUser,
  logOut,
  UpdateUser,
  changPassword,
  verifyEmail,
  resetPassword,
  requestPasswordReset,
  promoteUserToAdmin,
  getAllUser,
  deleteUser,
} = require("../controllers/user.registration.js");
const { protect, adminMiddleware } = require("../middlewares/aouth.js");
const { sendVerificationEmail } = require("../middlewares/mail.config.js");
const{upload}=require("../middlewares/multer.upload.js")
const router = express.Router();

router.post("/register",upload.single("photo"), registerUser, sendVerificationEmail);
router.get("/verify-email/:code", protect, verifyEmail);
router.post("/resetRequest", requestPasswordReset, sendVerificationEmail);
router.post("/reset/:token", resetPassword);
router.post("/login", loginUser);
router.put("/promoteUser", protect, promoteUserToAdmin);
router.get("/getAllUserByAdmin", protect, adminMiddleware, getAllUser);
router.delete(
  "/getAllUserByAmin/:userId",
  protect,
  adminMiddleware,
  deleteUser
);
router.get("/profile", protect, getUserProfile); // Protected route to get user profile
router.put("/updateProfile", protect,upload.single("photo"),UpdateUser); // updated user data
router.put("/changPassword", protect, changPassword); /// route for the password change the process by protect authentication
router.post("/logout", logOut);
module.exports = router;
