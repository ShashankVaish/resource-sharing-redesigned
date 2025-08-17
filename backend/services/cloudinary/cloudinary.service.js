// cloudinaryService.js
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

    let resourceType = "auto"; // 'auto' works for both images and PDFs
    const isPDF = localFilePath.toLowerCase().endsWith(".pdf");

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      flags: isPDF ? undefined : "attachment:false", // Only for images
      use_filename: true,
      unique_filename: false,
      overwrite: true
    });

    fs.unlinkSync(localFilePath); // remove local file after upload
    return uploadResult.secure_url; // Direct URL for frontend
  } catch (error) {
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};
const uploadOnCloudinaryforpdf = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "raw",
      use_filename: true,
      unique_filename: false,
      overwrite: true
    });

    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);

    // 👇 inject fl_attachment:false into the URL
    const inlineUrl = uploadResult.secure_url.replace(
      "/upload/",
      "/upload/fl_attachment:false/"
    );

    return inlineUrl;
  } catch (error) {
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};


const deleteUploadOnCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) return null;

    // Extract public_id correctly for PDFs and images
    const parts = fileUrl.split("/");
    const publicIdWithExt = parts[parts.length - 1];
    const publicId = publicIdWithExt.split(".")[0];

    return await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return null;
  }
};

module.exports = {
  uploadOnCloudinaryforpdf,
  uploadOnCloudinary,
  deleteUploadOnCloudinary
};
