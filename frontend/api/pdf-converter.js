export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      console.log('Proxying request to external PDF converter...');
      console.log('Request body keys:', Object.keys(req.body || {}));
      
      // Use environment variable or fallback to default URL
      const pdfConverterUrl = process.env.PDF_CONVERTER_URL || 
        'https://resumeconvertorlatex.onrender.com/api/convertJsonTexToPdfLocally';
      
      console.log('Using PDF converter URL:', pdfConverterUrl);
      
      const response = await fetch(pdfConverterUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      console.log('External API response status:', response.status);
      console.log('External API response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('External API error:', data);
        return res.status(response.status).json({
          error: 'External PDF converter failed',
          details: data,
          status: response.status
        });
      }
      
      console.log('PDF conversion successful, response keys:', Object.keys(data || {}));
      res.status(200).json(data);
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ 
        error: 'Failed to proxy request to PDF converter',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
