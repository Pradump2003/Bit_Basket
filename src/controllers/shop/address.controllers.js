const expressAsyncHandler = require("express-async-handler");
const addressCollection = require("../../models/address.model");
const ErrorHandler = require("../../utils/ErrorHandler.utils");
const ApiResponse = require("../../utils/ApiResponse.utils");

const addAddress = expressAsyncHandler(async (req, res, next) => {
  const { address, city, pincode, phone, notes } = req.body;
  const userId = req.user._id;
  const newAddress = await addressCollection.create({
    userId,
    address,
    city,
    pincode,
    phone,
    notes,
  });
  if (!newAddress) return next(new Error("Address is not created", 404));
  new ApiResponse(200, true, "Address created successfully", newAddress).send(
    res
  );
});

const getAddress = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const allAddress = await addressCollection.find({ userId });
  if (allAddress.length === 0)
    return next(new ErrorHandler("No address found", 404));
  new ApiResponse(200, true, "Address fetched successfully", allAddress).send(
    res
  );
});

const editAddress = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { addressId } = req.params;
  const updateAddress = await addressCollection.findOneAndUpdate(
    {
      userId,
      _id: addressId,
    }, // filter part
    req.body, // update part
    { new: true, runValidators: true }
  );
  if (!updateAddress) return next(new ErrorHandler("Address not found", 404));
  new ApiResponse(
    200,
    true,
    "Address updated successfully",
    updateAddress
  ).send(res);
});

const deleteAddress = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { addressId } = req.params;
  const deletedAddress = await addressCollection.findByIdAndDelete({
    userId,
    _id: addressId,
  });
  if (!deletedAddress) return next(new ErrorHandler("Item not found", 404));
  new ApiResponse(
    200,
    true,
    "Address Deleted successfully",
    deletedAddress
  ).send(res);
});

const getOneAddress = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { addressId } = req.params;
  const oneAddress = await addressCollection.findOne({
    userId,
    _id: addressId,
  });
  if (!oneAddress) return next(new ErrorHandler("Address not found", 404));
  new ApiResponse(200, true, "Address Fetched Successfully", oneAddress).send(
    res
  );
});

module.exports = {
  addAddress,
  getAddress,
  editAddress,
  deleteAddress,
  getOneAddress,
};
