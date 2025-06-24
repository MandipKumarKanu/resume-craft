# Proxy Configuration Documentation

This document explains how the proxy configuration works for both development and production environments.

## Overview

The application needs to make requests to an external PDF converter service. Due to CORS restrictions, we use a proxy approach.

## Configuration

### Development (Vite)
- Uses Vite's built-in proxy configuration in `vite.config.js`
- Routes `/proxy` requests to the external service
- Direct proxy without serverless function overhead

### Production (Vercel)
- Uses Vercel serverless function at `/api/pdf-converter.js`
- Vercel rewrites `/proxy` to `/api/pdf-converter` via `vercel.json`
- Handles CORS and error handling server-side

## Files Modified

1. **vercel.json**: Added rewrite rule for `/proxy` → `/api/pdf-converter`
2. **UploadForm.jsx**: Simplified to always use `/proxy` endpoint
3. **axios.js**: Made base URL environment-aware
4. **pdf-converter.js**: Enhanced error handling and logging
5. **.env.example**: Added environment variable examples

## Environment Variables

### Optional Variables:
- `VITE_API_BASE_URL`: Override default API base URL
- `PDF_CONVERTER_URL`: Override external PDF converter URL

## How It Works

### Development Flow:
1. Frontend makes request to `/proxy`
2. Vite proxy forwards to external service
3. Response returned directly

### Production Flow:
1. Frontend makes request to `/proxy`
2. Vercel rewrite routes to `/api/pdf-converter`
3. Serverless function proxies to external service
4. Response returned through serverless function

## Benefits

- **Consistent API**: Same `/proxy` endpoint in both environments
- **CORS Handling**: Server-side proxy eliminates CORS issues
- **Error Handling**: Centralized error handling and logging
- **Environment Flexibility**: Easy to switch between local/production APIs
- **Security**: API keys and external URLs can be hidden server-side

## Testing

### Development:
```bash
npm run dev
# Test the /proxy endpoint
```

### Production:
```bash
npm run build
vercel dev
# Test the same /proxy endpoint
```

Both should work identically from the frontend perspective.
