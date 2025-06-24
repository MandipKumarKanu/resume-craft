const https = require('https');
const http = require('http');

const testUrlAccessibility = (url) => {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const request = protocol.get(url, (response) => {
      resolve(response.statusCode >= 200 && response.statusCode < 400);
    });
    
    request.on('error', (error) => {
      console.error('URL accessibility test error:', error.message);
      resolve(false);
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      console.warn('URL accessibility test timeout for:', url);
      resolve(false);
    });
  });
};

const generateCloudinaryDownloadUrl = (cloudName, publicId, format) => {
  return `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment/${publicId}.${format}`;
};

module.exports = {
  testUrlAccessibility,
  generateCloudinaryDownloadUrl
};
