const fs = require("fs");
const path = require("path");
const latex = require("node-latex");
const { promisify } = require("util");
const cloudinary = require("../utils/cloudinary");
const Counter = require('../models/Counter');
require("dotenv").config();

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

const convertJsonTexToPdfLocally = async (req, res) => {
  const { formattedLatex, email, name, title } = req.body;

  if (!formattedLatex) {
    return res.status(400).json({ error: "LaTeX content is required" });
  }

  try {
    const outputDir = path.resolve("/tmp");

    const timestamp = Date.now();
    const texFilePath = path.join(outputDir, `resume_${timestamp}.tex`);
    const pdfFilePath = path.join(outputDir, `resume_${timestamp}.pdf`);
    const errorLogPath = path.join(outputDir, `latex_error_${timestamp}.log`);

    await writeFileAsync(texFilePath, formattedLatex);
    const pdfStream = latex(formattedLatex, {
      errorLogs: errorLogPath,
      passes: 2,
      cmd: "pdflatex", 
      inputs: [outputDir],
      precompiled: false,
      shellEscape: true,
    });

    const output = fs.createWriteStream(pdfFilePath);

    await new Promise((resolve, reject) => {
      pdfStream.pipe(output);

      pdfStream.on("error", async (err) => {
        console.error("LaTeX compilation error:", err);
        try {
          await unlinkAsync(texFilePath);
        } catch {}
        try {
          if (fs.existsSync(errorLogPath)) await unlinkAsync(errorLogPath);
        } catch {}
        reject(err);
      });

      output.on("finish", () => {
        resolve();
      });

      output.on("error", async (err) => {
        console.error("Error writing PDF file:", err);
        try {
          await unlinkAsync(texFilePath);
        } catch {}
        reject(err);
      });
    });

    console.log("PDF generated locally, starting upload to Cloudinary...");

    const uploadResult = await cloudinary.uploader.upload(pdfFilePath, {
      resource_type: "raw",
      format: "pdf",
      public_id: `resume_${name?.replace(/\s+/g, "_")}_${timestamp}`,
    });

    console.log("Upload successful:", uploadResult.secure_url);

    try {
      await Counter.incrementCounter('total_cv_count');
      console.log("CV count incremented successfully");
    } catch (countErr) {
      console.error('Error incrementing CV count:', countErr);
    }

    try {
      await unlinkAsync(texFilePath);
      await unlinkAsync(pdfFilePath);
      if (fs.existsSync(errorLogPath)) {
        await unlinkAsync(errorLogPath);
      }
      console.log("Local files cleaned up");
    } catch (cleanupErr) {
      console.error("Cleanup error:", cleanupErr);
    }

    return res.status(200).json({
      pdfUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      name: uploadResult.original_filename || `${name}_${title}_resume.pdf`,
      message: "PDF generated and uploaded successfully",
    });
  } catch (error) {
    console.error("Error in PDF generation:", error);
    return res.status(500).json({
      error: "PDF generation failed",
      details: error.message,
    });
  }
};

const getCount = async (req, res) => {
  try {
    const count = await Counter.getCount('total_cv_count');
    res.status(200).json({
      count: count,
      message: "CV count retrieved successfully",
    });
  } catch (error) {
    console.error('Error getting CV count:', error);
    res.status(500).json({
      count: 0,
      message: "Error retrieving CV count",
      error: error.message
    });
  }
};

const resetCount = async (req, res) => {
  try {
    await Counter.findOneAndUpdate(
      { name: 'total_cv_count' },
      { count: 0 },
      { upsert: true }
    );
    res.status(200).json({
      count: 0,
      message: "CV count reset successfully",
    });
  } catch (error) {
    console.error('Error resetting CV count:', error);
    res.status(500).json({
      count: 0,
      message: "Error resetting CV count",
      error: error.message
    });
  }
};

module.exports = {
  convertJsonTexToPdfLocally,
  getCount,
  resetCount,
};
