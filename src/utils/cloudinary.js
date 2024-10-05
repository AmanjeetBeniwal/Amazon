const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "dic9npjta",
  api_key: "494614195416951",
  api_secret: "ZXP5UasDhyEz0j7m_-RG-adTZpo",
});
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    console.log("File uploaded successfully and deleted from server:", response);
    console.log(response);

    return response;
  } catch (error) {
    // console.log(error);
    fs.unlinkSync(localFilePath);
    return null;
  } 
};

module.exports = { uploadOnCloudinary };
