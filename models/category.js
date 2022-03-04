const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  icon: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
});

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

categorySchema.set("toJSON", {
  virtuals: true,
});

exports.Category = mongoose.model("Category", categorySchema);
