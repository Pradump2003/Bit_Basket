const expressAsyncHandler = require("express-async-handler");
const productCollection = require("../../models/product.model");
const ErrorHandler = require("../../utils/ErrorHandler.utils");
const cartCollection = require("../../models/cart.model");
const ApiResponse = require("../../utils/ApiResponse.utils");

const addToCart = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.body;
  const product = await productCollection.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));
  let cart = await cartCollection.findOne({ userId });
  if (!cart) {
    cart = await cartCollection.create({ userId, items: [] });
  }
  const index = cart.items.findIndex(
    (item) => item.productId.toString() == productId
  );
  if (index === -1) {
    cart.items.push({ productId, quantity: 1 });
  } else {
    cart.items[index].quantity += 1;
  }

  await cart.save();
  new ApiResponse(200, true, "Product Added Successfully", cart).send(res);
});

const fetchCartItems = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const cart = await cartCollection.findOne({ userId }).populate({
    path: "items.productId",
    select: "image title price salePrice brand",
  });
  if (!cart) return next(new ErrorHandler("Cart not found", 404));
  // new ApiResponse(200, true, "Cart Items Fetched Successfully", cart).send(res);
  //update the item if productId null or undefined
  const validItems = cart.items.filter((item) => item.productId);

  if (validItems.length < cart.items.length) {
    cart.items = validItems;
    await save(); // save the cart in the database
  }

  const populateCartItems = validItems.map((item) => ({
    productId: item.productId._id,
    quantity: item.quantity,
    title: item.productId.title,
    image: item.productId.image,
    brand: item.productId.brand,
    price: item.productId.price,
    salePrice: item.productId.salePrice,
  }));

  const cartItems = {
    ...cart.toObject(),
    items: populateCartItems,
    isEmpty: populateCartItems.length === 0,
  };

  const message =
    populateCartItems.length === 0
      ? "Cart is empty"
      : "Cart items fetched successfully";

  new ApiResponse(200, true, message, cartItems).send(res);
});

const updateCartItem = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.body;
  const cart = await cartCollection.findOne({ userId });
  if (!cart) return next(new ErrorHandler("Cart not Found", 404));

  // item.productId is a Mongoose ObjectId.
  // productId (from req.body)
  const index = cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (index === -1) {
    return next(new ErrorHandler("Product not found in the cart", 404));
  }

  cart.items[index].quantity -= 1; // decrease the cart item

  await cart.save();

  //Re-populate the cart items after saving to get the latest product details.
  await cart.populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  // Re-filter valid items in case any products were deleted while the cart was being updated.
  const validItems = cart.items.filter((item) => item.productId);
  if (validItems.length < cart.items.length) {
    cart.items = validItems;
    await save();
  }

  const populatedCartItems = validItems.map((item) => ({
    productId: item.productId?._id || null,
    quantity: item.quantity || 0,
    image: item.productId?.image || null,
    title: item.productId?.title || "Product not found",
    brand: item.productId?.brand || null,
    price: item.productId?.price || 0,
    salePrice: item.productId?.salePrice || 0,
  }));

  const cartItems = {
    ...cart.toObject(),
    items: populatedCartItems,
    isEmpty: populatedCartItems.length === 0,
  };

  const message =
    populatedCartItems.length === 0
      ? "cart is empty"
      : "Product quantity updated successfully";

  new ApiResponse(200, true, message, cartItems).send(res);
});

const deleteCartItems = expressAsyncHandler(async (req, res, next) => {
  let userId = req.user._id;
  let { productId } = req.params;
  const cart = await cartCollection.findOne({ userId }).populate({
    path: "items.productId",
    select: "image title brand price salePrice",
  });
  if (!cart) return next(ErrorHandler("Product not found", 404));
  // new ApiResponse(200, true, "Item deleted Successfully", cart).send(res);

  const index = cart.items.findIndex(
    (item) => item.productId && item.productId._id.toString() === productId
  );

  if (index == -1) {
    return next(new ErrorHandler("Product not found in cart", 404));
  }

  cart.items.splice(index, 1);
  await cart.save();

  // Re-populate the cart items after deletion to ensure the response has up-to-date product details.
  await cart.populate({
    path: "items.productId",
    select: "image title brand price salePrice",
  });

  const validItems = cart.items.filter((item) => item.productId);
  const populatedCartItem = validItems.map((item) => ({
    productId: item.productId._id,
    quantity: item.quantity,
    title: item.productId.title,
    image: item.productId.image,
    brand: item.productId.brand,
    price: item.productId.price,
    salePrice: item.productId.salePrice,
  }));

  const cartItems = {
    ...cart.toObject(),
    items: populatedCartItem,
    isEmpty: populatedCartItem.length === 0,
  };

  const message =
    populatedCartItem.length === 0
      ? "Cart is Empty"
      : "Cart item removed successfully";

  new ApiResponse(200, true, message, cartItems).send(res);
});

const clearCart = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const cart = await cartCollection.findOne({ userId });
  if (!cart) return next(new ErrorHandler("Cart not found", 404));
  cart.items = [];

  await cart.save();

  const emptyCart = {
    ...cart.toObject(),
    items: [],
    isEmpty: true,
  };

  new ApiResponse(200, true, "Cart cleared successfully", emptyCart).send(res);
});

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItem,
  deleteCartItems,
  clearCart,
};

// findOne = Finds the first document that matches the filter condition (can be any field).
//findById = Finds a document by its _id. its only work in id
