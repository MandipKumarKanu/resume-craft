const express = require("express");
const mongoose = require("mongoose");
const { pdfUpload, extractPdfData } = require("../controllers/pdfController");
const { ConvertLatex } = require("../controllers/latexController");
const { texContentUpload } = require("../controllers/texUploadController");
const { convertJsonTexToPdfLocally, getCount, resetCount } = require("../controllers/pdfGeneratorController");
const { singleFileUpload } = require("../middleware/upload");
const fileCleanupService = require("../services/fileCleanupService");

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

router.get("/ping-db", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database not connected",
        status: "disconnected",
        readyState: mongoose.connection.readyState
      });
    }

    await mongoose.connection.db.admin().ping();
    
    res.json({
      success: true,
      message: "Database connection is healthy",
      status: "connected",
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database ping failed:', error);
    res.status(500).json({
      success: false,
      message: "Database ping failed",
      error: error.message,
      status: "error"
    });
  }
});

router.post("/cron/cleanup", async (req, res) => {
  try {
    console.log('🕐 Cron job triggered file cleanup...');
    const result = await fileCleanupService.performCleanup();
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result,
      status: "🕐 Cron Cleanup Completed"
    });
  } catch (error) {
    console.error('❌ Cron cleanup failed:', error);
    res.status(500).json({
      success: false,
      message: "Cleanup process failed",
      error: error.message,
      status: "❌ Cron Failed"
    });
  }
});

router.post("/emergency-cleanup", async (req, res) => {
  try {
    const result = await fileCleanupService.emergencyCleanup();
    res.json({
      success: true,
      ...result,
      status: "🚨 Emergency Cleanup Completed"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Emergency cleanup failed",
      error: error.message,
      status: "❌ Emergency Failed"
    });
  }
});

module.exports = router;
