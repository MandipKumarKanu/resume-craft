// Example backend route for PDF conversion
// Add this to your backend server (Express.js example)

// POST /api/convert-to-pdf
app.post('/api/convert-to-pdf', async (req, res) => {
  try {
    console.log('Converting LaTeX to PDF...');
    
    // Make the request to the external PDF converter service
    const response = await fetch(
      'https://resumeconvertorlatex.onrender.com/api/convertJsonTexToPdfLocally',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(req.body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('PDF conversion failed:', errorData);
      return res.status(response.status).json({
        error: 'PDF conversion failed',
        details: errorData
      });
    }

    const pdfData = await response.json();
    console.log('PDF conversion successful');
    
    res.json(pdfData);
  } catch (error) {
    console.error('PDF conversion error:', error);
    res.status(500).json({
      error: 'Failed to convert PDF',
      details: error.message
    });
  }
});

// Alternative using axios if you prefer:
/*
const axios = require('axios');

app.post('/api/convert-to-pdf', async (req, res) => {
  try {
    const response = await axios.post(
      'https://resumeconvertorlatex.onrender.com/api/convertJsonTexToPdfLocally',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('PDF conversion error:', error);
    res.status(500).json({
      error: 'Failed to convert PDF',
      details: error.response?.data || error.message
    });
  }
});
*/
