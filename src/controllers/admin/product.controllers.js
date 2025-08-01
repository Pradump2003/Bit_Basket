const productCollection = require("../../models/product.model");
const expressAsyncHandler = require("express-async-handler");
const ApiResponse = require("../../utils/ApiResponse.utils");
const ErrorHandler = require("../../utils/ErrorHandler.utils");
const {
  uploadImageOnCloudinary,
  getPublicId,
  deleteImageFromCloudinary,
} = require("../../utils/cloudinary.utils");

const uploadImage = expressAsyncHandler(async (req, res, next) => {
  // console.log(req.file); // for uploading single image
  // console.log(req.files); // for uploading multiple images

  let b64 = Buffer.from(req.file.buffer).toString("base64");
  let url = "data:" + req.file.mimetype + ";base64," + b64;
  //this is the format to pass the url in cloudinary,

  // console.log(url);
  let uploaded = await uploadImageOnCloudinary(url);
  // console.log(uploaded);
  new ApiResponse(
    200,
    true,
    "Image uploaded successfully",
    uploaded.secure_url,
    uploaded.asset_id
  ).send(res);
});

const deleteImage = expressAsyncHandler(async (req, res, next) => {
  let url = req.body.url;
  let public_id = getPublicId(url);
  let deletedImage = await deleteImageFromCloudinary(public_id);
  if (deletedImage && deletedImage.result === "ok") {
    new ApiResponse(200, true, "Image deleted successfully").send(res);
  }
  if (deletedImage.result === "not found") {
    return next(new ErrorHandler("image not found", 404));
  }
  return next(new ErrorHandler(deletedImage.result, 400));
});

const addProduct = expressAsyncHandler(async (req, res, next) => {
  let {
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
    averageReview,
  } = req.body;

  let product = await productCollection.create({
    image,
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
    averageReview,
  });
  new ApiResponse(200, true, "Products created successfully", product).send(
    res
  );
});

const getAllProducts = expressAsyncHandler(async (req, res, next) => {
  const allProducts = await productCollection.find();
  if (allProducts.length === 0)
    return next(new ErrorHandler("No product found", 404));
  new ApiResponse(200, true, "All Products fetched", allProducts).send(res);
});

const getProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productCollection.findById(id);
  if (!product) return next(new ErrorHandler("Product not found", 404));
  new ApiResponse(200, true, "Product fetched successfully", product).send(res);
});

const updateProduct = expressAsyncHandler(async (req, res, next) => {
  let product = await productCollection.findByIdAndUpdate(
    req.params.id, // filter part
    req.body, // updated part
    {
      new: true, // return the updated document
      runValidators: true, // validate the update against scheme
    }
  );
  console.log(product);
  if (!product) return next(new ErrorHandler("Product not found", 404));
  new ApiResponse(200, true, "Product updated successfully", product).send(res);
});

const deleteProduct = expressAsyncHandler(async (req, res, next) => {
  let product = await productCollection.findByIdAndDelete(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));
  new ApiResponse(200, true, "Product deleted successfully", product).send(res);
});

module.exports = {
  uploadImage,
  deleteImage,
  addProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
