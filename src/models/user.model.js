const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userScheema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { required: true, unique: true, type: String },
    phone: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    address: { type: String, required: true },
    verificationCode: String,
    verificationAttempts: { type: Number, default: 0 },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);
userScheema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // this.verificationCode = Math.floor((Math.random() * 900000) + 100000).toString();
  }
  next();
});
// method to compare the password
userScheema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model("User", userScheema);
module.exports = User;
