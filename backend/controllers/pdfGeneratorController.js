const fs = require("fs");
const path = require("path");
const latex = require("node-latex");
const { promisify } = require("util");
const cloudinary = require("../utils/cloudinary");
require("dotenv").config();

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

const convertJsonTexToPdfLocally = async (req, res) => {
  const { formattedLatex, email, name, title } = req.body;

  if (!formattedLatex) {
    return res.status(400).json({ error: "LaTeX content is required" });
  }

  try {
    const outputDir = path.resolve("pdfs");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

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
  res.status(200).json({
    count: 0,
    message: "Count feature not implemented yet",
  });
};

module.exports = {
  convertJsonTexToPdfLocally,
  getCount,
};
