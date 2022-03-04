const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  brand: {
    type: mongoose.Types.ObjectId,
    ref: "Brand",
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  size: {
    type: mongoose.Types.ObjectId,
    ref: "Size",
  },
  color: {
    type: mongoose.Types.ObjectId,
    ref: "Color",
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: mongoose.Types.ObjectId,
    ref: "Type",
  },
});

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.set("toJSON", {
  virtuals: true,
});

exports.Product = mongoose.model("Product", productSchema);
