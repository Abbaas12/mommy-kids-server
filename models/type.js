const mongoose = require("mongoose");

const typeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

typeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

typeSchema.set("toJSON", {
  virtuals: true,
});

exports.Type = mongoose.model("Type", typeSchema);
