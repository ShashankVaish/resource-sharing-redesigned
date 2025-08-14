const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config(); 


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    fs.unlinkSync(localFilePath);
    return uploadResult;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error(error);
    return null;
  }
};

const deleteUploadOnCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) return null;
    const publicId = fileUrl.split("/").pop().split(".")[0];
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting file:", error);
    return null;
  }
};
module.exports = {
  uploadOnCloudinary,
  deleteUploadOnCloudinary
};
