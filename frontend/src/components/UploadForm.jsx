import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  Zap,
  Brain,
  Settings,
  Sparkles,
  X,
  CheckCircle,
  Loader2,
  Briefcase,
  FileInput,
} from "lucide-react";
import customAxios from "../config/axios";
import axios from "axios";

const UploadForm = () => {
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [selectedAPI, setSelectedAPI] = useState("api_1");
  const [selectedTemplate, setSelectedTemplate] = useState("v1");
  const [isTargeted, setIsTargeted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [extractionResult, setExtractionResult] = useState(null);
  const [conversionResult, setConversionResult] = useState(null);
  const [texUploadResult, setTexUploadResult] = useState(null);
  const [pdfResult, setPdfResult] = useState(null);

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setIsUploaded(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setIsUploaded(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setIsUploaded(false);
    setIsCompleted(false);
    setUploadProgress(0);
    setUploadResponse(null);
    setExtractionResult(null);
    setConversionResult(null);
    setTexUploadResult(null);
    setPdfResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      if (isTargeted && jobTitle) {
        formData.append("jobTitle", jobTitle);
      }
      if (isTargeted && jobDescription) {
        formData.append("jobDescription", jobDescription);
      }

      const response = await customAxios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      setIsUploaded(true);
      setUploadResponse(response.data);
      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleProcess = async () => {
    if (!isUploaded || !uploadResponse) return;

    setIsProcessing(true);

    try {
      console.log("Step 1: Extracting PDF data...");
      const extractResponse = await customAxios.post("/api/extract-pdf", {
        pdfUrl: uploadResponse.url,
      });

      console.log("PDF extraction successful:", extractResponse.data);
      setExtractionResult(extractResponse.data);

      console.log("Step 2: Converting to LaTeX...");
      const conversionPayload = {
        extractedData: extractResponse.data,
        template: selectedTemplate,
        model:
          selectedModel === "gemini-1.5-flash"
            ? "Gemini 1.5 Flash"
            : "Gemini 2.0 Flash",
        apiProvider: selectedAPI,
        isTailoredResume: isTargeted,
        ...(isTargeted && jobTitle && { jobTitle }),
        ...(isTargeted && jobDescription && { jobDescription }),
      };

      const conversionResponse = await customAxios.post(
        "/api/convert-latex",
        conversionPayload
      );

      console.log("LaTeX conversion successful:", conversionResponse.data);
      setConversionResult(conversionResponse.data);

      console.log("Step 3: Uploading LaTeX content and converting to PDF...");

      // const pdfConverterUrl = process.env.NODE_ENV === 'development' 
      //   ? "/api/proxy/convertJsonTexToPdfLocally"
      //   : "/proxy";
      const pdfConverterUrl = "/proxy/api/convertJsonTexToPdfLocally"

      const [uploadTexResponse, pdfConversionResponse] = await Promise.all([
        customAxios.post("/api/upload-tex-content", conversionResponse.data),
        axios.post(pdfConverterUrl, conversionResponse.data),
      ]);

      console.log("LaTeX upload successful:", uploadTexResponse.data);
      console.log("PDF conversion successful:", pdfConversionResponse.data);

      setTexUploadResult(uploadTexResponse.data);
      setPdfResult(pdfConversionResponse.data);

      setIsCompleted(true);

      navigate("/response", {
        state: {
          pdfResult: pdfConversionResponse.data,
          texUploadResult: uploadTexResponse.data,
          conversionResult: conversionResponse.data,
        },
      });
    } catch (error) {
      console.error("Processing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="glass-warning mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-yellow-300">
            Beta Feature
          </span>
        </div>
        <p className="text-xs text-yellow-200/80">
          This is an experimental AI feature. Results may vary. For best
          results, use clear, well-formatted PDFs.
        </p>
      </div>

      <div className="glass-card-main overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  AI Resume Forge
                </h2>
                <p className="text-sm text-gray-400">
                  Transform your resume with AI
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">Smart Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isTargeted}
                  onChange={(e) => setIsTargeted(e.target.checked)}
                />
                <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-blue-500"></div>
              </label>
            </div>
          </div>
        </div>

        {isTargeted && (
          <div className="p-6 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 border-b border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Job Details</h3>
              <div className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full font-medium">
                SMART MODE
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  className="cyber-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Job Description
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here to optimize your resume..."
                  rows="4"
                  className="cyber-textarea"
                />
              </div>
            </div>
          </div>
        )}

        <div className="p-6 space-y-6 border-b border-white/10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-white">
                Resume Template
              </label>
              <div className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium">
                DESIGN
              </div>
            </div>
            <select
              className="cyber-select"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="v1">
                Modern Professional - Clean, ATS-friendly
              </option>
              <option value="v2">
                Academic Excellence - Perfect for research roles
              </option>
              <option value="v2_new">
                Enhanced Classic - Traditional with a twist
              </option>
              <option value="v3">
                Creative Edge - Stand out with subtle color accents
              </option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-white">AI Model</label>
              <div className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full font-medium">
                PREMIUM
              </div>
            </div>
            <select
              className="cyber-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</option>
              <option value="gemini-2.0-flash">
                Gemini 2.0 Flash (Best Quality)
              </option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-white">
                Processing Power
              </label>
            </div>
            <select
              className="cyber-select"
              value={selectedAPI}
              onChange={(e) => setSelectedAPI(e.target.value)}
            >
              <option value="api_1">API 1 (Recommended)</option>
              <option value="api_2">API 2</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
              isDragOver
                ? "border-purple-400 bg-purple-500/10 scale-105"
                : selectedFile
                ? "border-emerald-400 bg-emerald-500/10"
                : "border-gray-600 hover:border-purple-500 hover:bg-purple-500/5"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center space-y-4">
              {selectedFile ? (
                <>
                  <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center relative">
                    <FileText className="w-8 h-8 text-emerald-400" />
                    {isUploaded && (
                      <CheckCircle className="w-6 h-6 text-emerald-400 absolute -top-1 -right-1 bg-gray-900 rounded-full" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <p className="text-lg font-semibold text-emerald-400">
                        {selectedFile.name}
                      </p>
                      <button
                        onClick={handleRemoveFile}
                        className="p-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      {isUploaded
                        ? " • Uploaded successfully"
                        : " • Ready to upload"}
                    </p>

                    {isUploading && (
                      <div className="mt-3">
                        <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white mb-2">
                      Drop your resume here
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      or click to browse • PDF files only • Max 10MB
                    </p>
                  </div>
                </>
              )}

              <input
                type="file"
                className="hidden"
                id="fileInput"
                accept=".pdf"
                onChange={handleFileSelect}
              />

              {!selectedFile && (
                <label
                  htmlFor="fileInput"
                  className="cyber-button-secondary cursor-pointer inline-flex items-center gap-2"
                >
                  <FileInput className="w-4 h-4" />
                  Choose File
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 space-y-3">
          {selectedFile && !isUploaded && !isCompleted && (
            <button
              className="w-full cyber-button-upload relative overflow-hidden"
              disabled={isUploading}
              onClick={handleUpload}
            >
              <div className="flex items-center justify-center gap-3">
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-semibold">
                      Uploading... {uploadProgress}%
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span className="font-semibold">Upload PDF</span>
                  </>
                )}
              </div>
            </button>
          )}

          {isUploaded && !isCompleted && (
            <button
              className="w-full cyber-button-primary relative overflow-hidden"
              disabled={isProcessing}
              onClick={handleProcess}
            >
              <div className="flex items-center justify-center gap-3">
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-semibold">
                      Forging Your Resume...
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold">Transform with AI</span>
                  </>
                )}
              </div>

              {isProcessing && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-pulse"
                  style={{ backgroundSize: "200% 100%" }}
                />
              )}
            </button>
          )}

          {selectedFile && !isUploading && !isProcessing && (
            <p className="text-center text-xs text-gray-400">
              {!isUploaded
                ? "Upload your PDF first, then transform it with AI"
                : "Ready to transform! Estimated time: 15-30 seconds"}
            </p>
          )}
        </div>

        {(extractionResult || conversionResult) && (
          <div className="p-6 border-t border-white/10 bg-gradient-to-br from-emerald-500/5 to-blue-500/5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">
                {texUploadResult
                  ? "Processing Complete - Redirecting..."
                  : conversionResult
                  ? "Conversion Complete"
                  : "Extraction Complete"}
              </h3>
            </div>

            {conversionResult ? (
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-emerald-400 mb-2">
                    LaTeX Content
                  </h4>
                  <div className="max-h-48 overflow-y-auto">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                      {conversionResult.formattedLatex?.substring(0, 1000)}
                      {conversionResult.formattedLatex?.length > 1000 && "..."}
                    </pre>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-purple-400 mb-2">
                    CV Metadata
                  </h4>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>
                      <span className="text-gray-400">Name:</span>{" "}
                      {conversionResult.name}
                    </p>
                    <p>
                      <span className="text-gray-400">Title:</span>{" "}
                      {conversionResult.title}
                    </p>
                    <p>
                      <span className="text-gray-400">Email:</span>{" "}
                      {conversionResult.email}
                    </p>
                  </div>
                </div>

                {texUploadResult && (
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-400 mb-2">
                      Files Generated
                    </h4>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p>
                        <span className="text-gray-400">LaTeX File:</span>
                        <span className="text-emerald-400 ml-2">
                          ✓ Generated
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-400">PDF File:</span>
                        <span className="text-emerald-400 ml-2">
                          ✓ Generated
                        </span>
                      </p>
                      <p className="text-xs text-emerald-400 mt-2">
                        {texUploadResult.message}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(extractionResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
