const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        _id: false, // this will not create _id field in nested objects.
      },
    ],
  },
  { timestamps: true }
);

// ObjectId: A special MongoDB type used for referencing other documents.

module.exports = mongoose.model("cart", cartSchema);
