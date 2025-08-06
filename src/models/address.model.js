const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is Required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlenght: [5, "Address must be at least 5 characters long"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      lowercase: true,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
    },
    phone: {
      type: Number,
      required: [true, "Phone number is required"],
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
