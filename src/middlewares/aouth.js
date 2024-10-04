const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);

  if (!token) { 
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    // console.log({message:"user is admin "});
    
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};
module.exports = { protect,adminMiddleware };

