const mongoose = require("mongoose");

const saleItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  salePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  salename: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

saleItemSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

saleItemSchema.set("toJSON", {
  virtuals: true,
});

exports.SaleItem = mongoose.model("SaleItem", saleItemSchema);
