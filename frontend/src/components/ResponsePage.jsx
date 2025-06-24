import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Download, Code, ExternalLink, ArrowLeft, FileText, Sparkles } from 'lucide-react';

const ResponsePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('pdf');
  const [isPdfLoading, setIsPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(null);

  const { 
    pdfResult, 
    texUploadResult, 
    conversionResult 
  } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    if (!pdfResult || !texUploadResult || !conversionResult) {
      navigate('/');
    }
    
    window.scrollTo(0, 0);
  }, [pdfResult, texUploadResult, conversionResult, navigate]);

  const handleDownloadPdf = () => {
    if (pdfResult?.pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfResult.pdfUrl;
      link.download = `${pdfResult.name || 'resume'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenInOverleaf = () => {
    if (texUploadResult?.data?.url) {
      const overleafUrl = `https://www.overleaf.com/docs?snip_uri=${encodeURIComponent(texUploadResult.data.url)}`;
      window.open(overleafUrl, '_blank');
    }
  };

  const handleCopyCode = async () => {
    if (conversionResult?.formattedLatex) {
      try {
        await navigator.clipboard.writeText(conversionResult.formattedLatex);
        alert('LaTeX code copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const handleConvertAnother = () => {
    navigate('/');
  };

  if (!pdfResult || !texUploadResult || !conversionResult) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleConvertAnother}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Your Resume is Ready! 🎉</h1>
                <p className="text-gray-400 mt-1">
                  Your resume has been transformed into a professional LaTeX format. 
                  View the PDF preview or access the LaTeX source code below.
                </p>
              </div>
            </div>
            
            <button
              onClick={handleConvertAnother}
              className="cyber-button-secondary flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Convert Another Resume
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'pdf'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Rendered PDF
            </div>
          </button>
          <button
            onClick={() => setActiveTab('latex')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'latex'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              LaTeX Code
            </div>
          </button>
        </div>

        {activeTab === 'pdf' && (
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">PDF Preview</h3>
                <p className="text-sm text-gray-400">{pdfResult?.message || 'Your generated resume'}</p>
              </div>
              <button
                onClick={handleDownloadPdf}
                className="cyber-button-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
            
            <div className="p-4">
              <div className="w-full flex justify-center bg-gray-50 rounded-lg">
                {pdfResult?.pdfUrl ? (
                  <div className="w-full h-[800px] bg-white rounded-lg overflow-hidden shadow-inner">
                    <iframe
                      src={`${pdfResult.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                      className="w-full h-full border-0"
                      title="Resume PDF Preview"
                      style={{ 
                        border: 'none',
                        outline: 'none'
                      }}
                      onLoad={() => {
                        setIsPdfLoading(false);
                        setPdfError(null);
                      }}
                      onError={() => {
                        setPdfError('Failed to load PDF');
                        setIsPdfLoading(false);
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[800px]">
                    <div className="text-center">
                      <p className="text-red-600">No PDF URL available</p>
                      <p className="text-sm text-gray-500 mt-2">Unable to load PDF preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'latex' && (
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">LaTeX Source Code</h3>
                <p className="text-sm text-gray-400">Edit and compile your resume source code</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleOpenInOverleaf}
                  className="cyber-button-primary flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Overleaf
                </button>
                <button
                  onClick={handleCopyCode}
                  className="cyber-button-secondary flex items-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  Copy Code
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="bg-gray-900 rounded-lg p-4 max-h-[800px] overflow-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                  {conversionResult.formattedLatex}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsePage;
