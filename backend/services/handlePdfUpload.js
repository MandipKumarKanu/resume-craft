const fs = require("fs");
const cloudinary = require("../utils/cloudinary");

const handlePdfUpload = async (file) => {
  try {
    if (!file) throw new Error("No file provided");

    const allowedMimeTypes = [
      "application/pdf",
      "application/x-tex",
      "text/x-tex",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      fs.unlinkSync(file.path);
      throw new Error("Only PDF and TEX files are allowed");
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "raw",
      format: file.originalname.split(".").pop(),
    });

    fs.unlinkSync(file.path);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      name: result.original_filename,
    };
  } catch (error) {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw error;
  }
};

module.exports = handlePdfUpload;
