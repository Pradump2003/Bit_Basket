const mongoose = require("mongoose");

//mongoose.schema is a constructor function so we use new keyword
const productSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Product image Url is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      lowercase: true,
      minlength: [3, "Title mus be at least 3 characters"],
      maxlength: [100, "Title can't exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      lowercase: true,
      minlength: [10, "Description at least 10 characters"], //minlength used for string
    },
    category: {
      type: String,
      trim: true,
      lowercase: true,
    },
    brand: {
      type: String,
      trim: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price can not be negative"], //min used for number
    },
    salePrice: {
      type: Number,
      default: 0,
      min: [0, "Sale price can not be negative"],
    },
    totalStock: {
      type: Number,
      required: [true, "Stock count is required"],
      min: [0, "Stock can not be negative"],
    },
    averageReview: {
      type: Number,
      default: 0,
      min: [0, "Review can not be negative"],
      max: [5, "Review can not be exceed 5"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
