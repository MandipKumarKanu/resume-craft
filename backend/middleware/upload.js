const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/x-tex",
    "text/x-tex",
    "text/plain"
  ];
  
  const allowedExtensions = ['pdf', 'tex'];
  const fileExtension = file.originalname.split('.').pop().toLowerCase();
  
  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and TEX files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 
  }
});

module.exports = {
  singleFileUpload: upload.single("file"),
};
