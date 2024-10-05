const express = require("express");
const router = express.Router();
const { protect, adminMiddleware } = require("../middlewares/aouth.js");
const {
  createProduct,
  UpdateProduct,
  getAllProduct,
  deleteProduct,
} = require("../controllers/product.creation.js");

const { upload } = require("../middlewares/multer.upload.js");

router.post(
  "/createProduct",
  protect,
  adminMiddleware,
  upload.fields([
    {
      name: "Image",
      maxCount: 4,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  createProduct
);

router.put(
  "/updateProduct/:productId",
  protect,
  adminMiddleware,
  upload.fields([
    {
      name: "Image",
      maxCount: 4,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  UpdateProduct
);

router.get("/getAllProduct", protect, getAllProduct); // Corrected typo from 'getAlllProduct' to 'getAllProduct'

router.delete("/delete/:productId", protect, adminMiddleware, deleteProduct); // Changed id to productId for clarity

module.exports = router;
