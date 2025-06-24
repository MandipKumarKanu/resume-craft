// controllers/pdfController.js
const cloudinary = require("../utils/cloudinary");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf");
const path = require('path');
const axios = require('axios');

pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(__dirname, '../node_modules/pdfjs-dist/legacy/build/pdf.worker.js');

const pdfUpload = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        data: [],
        status: false,
        message: "No file uploaded"
      });
    }

    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
    
    const allowedExtensions = ['pdf', 'tex'];
    const allowedMimeTypes = ['application/pdf', 'application/x-tex', 'text/x-tex'];
    
    if (!allowedExtensions.includes(fileExtension) || !allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        data: [],
        status: false,
        message: "Only PDF and TEX files are allowed"
      });
    }

    const { Readable } = require("stream");
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    const cloudinaryStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        format: fileExtension
      },
      (error, result) => {
        if (error) {
          console.error('Upload to Cloudinary failed:', error);
          return res.status(500).json({
            data: [],
            status: false,
            message: "Upload to Cloudinary failed"
          });
        }

        console.log("Cloudinary upload result:", {
          secure_url: result.secure_url,
          public_id: result.public_id,
          resource_type: result.resource_type,
          format: result.format
        });

        return res.json({
          url: result.secure_url,
          publicId: `${result.public_id}.${fileExtension}`,
          name: "file"
        });
      }
    );

    bufferStream.pipe(cloudinaryStream);
  } catch (err) {
    console.error('Error in pdfUpload:', err);
    res.status(500).json({
      data: [],
      status: false,
      message: err.message || "Server error"
    });
  }
};

const extractPdfData = async (req, res) => {
    try {
        const { pdfUrl } = req.body;
        if (!pdfUrl) {
            return res.status(400).json({ error: 'PDF URL is required' });
        }

        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        const pdfBuffer = Buffer.from(response.data, 'binary');

        const uint8Array = new Uint8Array(pdfBuffer);
        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        let extractedText = '';
        const links = [];

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            extractedText += pageText + '\n';

            const annotations = await page.getAnnotations();
            annotations.forEach(annotation => {
                if (annotation.subtype === 'Link' && annotation.url) {
                    const rect = annotation.rect;
                    const xMin = Math.min(rect[0], rect[2]);
                    const xMax = Math.max(rect[0], rect[2]);
                    const yMin = Math.min(rect[1], rect[3]);
                    const yMax = Math.max(rect[1], rect[3]);
                    let anchorText = '';
                    textContent.items.forEach(item => {
                        const x = item.transform[4];
                        const y = item.transform[5];
                        if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
                            anchorText += item.str + ' ';
                        }
                    });
                    anchorText = anchorText.trim().replace(/\s+/g, ' ');
                    if (anchorText) {
                        links.push({ url: annotation.url, context: anchorText });
                    }
                }
            });

            const urlRegex = /(https?:\/\/[^\s]+)/gi;
            let match;
            while ((match = urlRegex.exec(pageText)) !== null) {
                const url = match[0];
                const start = match.index;
                const end = start + url.length;
                const contextStart = Math.max(0, start - 30);
                const contextEnd = Math.min(pageText.length, end + 30);
                let context = pageText.slice(contextStart, contextEnd);
                context = context.replace(/^\S*\s/, '').replace(/\s\S*$/, '');
                links.push({ url, context });
            }
        }

        const extractedData = {
            text: extractedText,
            links
        };

        res.json({
          extractedData
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to process PDF' });
    }
};

module.exports = { pdfUpload, extractPdfData };
