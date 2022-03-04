const mongoose = require("mongoose");

const saleSchema = mongoose.Schema({
  customerName: {
    type: String,
    default: "",
  },
  saleItem: {
    type: mongoose.Types.ObjectId,
    ref: "SaleItem",
    required: true,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  adsFee: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
  },
  profit: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

saleSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

saleSchema.set("toJSON", {
  virtuals: true,
});

exports.Sale = mongoose.model("Sale", saleSchema);
