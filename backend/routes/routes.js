const express = require("express");
const { pdfUpload, extractPdfData } = require("../controllers/pdfController");
const { ConvertLatex } = require("../controllers/latexController");
const { texContentUpload } = require("../controllers/texUploadController");
const { convertJsonTexToPdfLocally, getCount, resetCount } = require("../controllers/pdfGeneratorController");
const { singleFileUpload } = require("../middleware/upload");

const router = express.Router();

const handleUploadError = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({
      message: err.message || "File upload error",
      status: false
    });
  }
  next();
};

router.post("/upload", singleFileUpload, handleUploadError, pdfUpload);
router.post("/extract-pdf", extractPdfData);
router.post("/convert-latex", ConvertLatex);
router.post("/upload-tex-content", texContentUpload);
router.post("/upload-tex-file", singleFileUpload, handleUploadError, texContentUpload);
router.post("/convertJsonTexToPdfLocally", convertJsonTexToPdfLocally);
router.get("/getCount", getCount);
router.post("/resetCount", resetCount);

module.exports = router;
