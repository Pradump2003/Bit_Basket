const expressAsyncHandler = require("express-async-handler");
const v2 = require("../config/cloudinary.config");
const getPublicId = (url) => {
  let arr = url.split("/");
  let element = arr[arr.length - 1];
  let id = element.split(".")[0];
  let public_id = "bitbucket/" + id;
  return public_id;
};


const uploadImageOnCloudinary = expressAsyncHandler(async (url) => {
  // v2.uploader.upload(...)	Cloudinary's method to upload media (images, videos, etc.).
  const uploaded = await v2.uploader.upload(url, {
    folder: "bitbucket",
    resource_type: "auto",
  });
  console.log(uploaded);
  return uploaded;
});

const deleteImageFromCloudinary = expressAsyncHandler(async (public_id) => {
  let response = await v2.uploader.destroy(public_id);
  return response;
});

module.exports = {
  uploadImageOnCloudinary,
  getPublicId,
  deleteImageFromCloudinary,
};
