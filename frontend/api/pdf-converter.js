export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      console.log('Proxying request to external PDF converter...');
      
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

      console.log('External API response status:', response.status);
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('External API error:', data);
        return res.status(response.status).json({
          error: 'External PDF converter failed',
          details: data
        });
      }
      
      console.log('PDF conversion successful');
      res.status(200).json(data);
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ 
        error: 'Failed to proxy request to PDF converter',
        details: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
