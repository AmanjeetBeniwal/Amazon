const mongooes = require("mongoose");
const productScheema = new mongooes.Schema(
  {
    Name: { type: String, required: true },
    Image: { type: [String ]},
    video:{type:String},
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const product = mongooes.model("products", productScheema);
module.exports = product;
