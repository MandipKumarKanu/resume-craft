const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const texContentUpload = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        if (req.headers['content-type']?.includes('application/json')) {
            const { formattedLatex } = req.body;
            
            if (!formattedLatex) {
                return res.status(400).json({
                    data: [],
                    status: false,
                    message: "No LaTeX content provided"
                });
            }

            const latexBuffer = Buffer.from(formattedLatex, 'utf8');

            const { Readable } = require("stream");
            const bufferStream = new Readable();
            bufferStream.push(latexBuffer);
            bufferStream.push(null); 
            const cloudinaryStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    format: 'tex',
                    public_id: `latex_${Date.now()}` 
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

                    console.log("LaTeX upload result:", {
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                        resource_type: result.resource_type,
                        format: result.format
                    });

                    return res.json({
                        data: {
                            url: result.secure_url,
                            name: `${result.public_id}.tex`,
                        },
                        status: true,
                        message: "LaTeX file created and uploaded successfully!"
                    });
                }
            );

            bufferStream.pipe(cloudinaryStream);
        }
        else if (req.file && req.file.buffer) {
            const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
            
            if (fileExtension !== 'tex') {
                return res.status(400).json({
                    data: [],
                    status: false,
                    message: "Only TEX files are allowed"
                });
            }

            const { Readable } = require("stream");
            const bufferStream = new Readable();
            bufferStream.push(req.file.buffer);
            bufferStream.push(null); 

            const cloudinaryStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    format: 'tex'
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

                    console.log("TEX file upload result:", {
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                        resource_type: result.resource_type,
                        format: result.format
                    });

                    return res.json({
                        data: {
                            url: result.secure_url,
                            name: `${result.public_id}.tex`,
                        },
                        status: true,
                        message: "TEX file uploaded successfully!"
                    });
                }
            );

            bufferStream.pipe(cloudinaryStream);
        }
        else {
            return res.status(400).json({
                data: [],
                status: false,
                message: "No LaTeX content or file provided"
            });
        }
    } catch (err) {
        console.error('Error in texContentUpload:', err);
        res.status(500).json({
            data: [],
            status: false,
            message: err.message || "Server error"
        });
    }
};

module.exports = { texContentUpload };
