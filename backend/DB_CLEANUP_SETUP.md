# 🕐 Database-Driven Auto-Deletion Setup

## MongoDB + Cron Job Cleanup System

This system tracks all uploaded files in MongoDB and automatically deletes them after 1 hour using external cron jobs.

### 🗃️ **How It Works**

1. **📤 File Upload**: Each upload is tracked in MongoDB with:
   - Public ID (Cloudinary)
   - Filename and file type
   - Upload timestamp
   - Scheduled deletion time (1 hour later)
   - User email (optional)

2. **⏰ Cron Job**: External service calls `/api/cron/cleanup` every hour
3. **🧹 Auto-Cleanup**: System finds expired files and deletes them from Cloudinary
4. **📊 Tracking**: Files marked as deleted in database for audit trail

### 🔧 **Cron-Job.org Setup**

1. **Visit**: https://cron-job.org/en/
2. **Create account** and add new cron job:

```
Title: LaTeX CV Auto-Delete
URL: https://your-domain.com/api/cron/cleanup
Method: POST
Schedule: 0 * * * * (every hour)
Timeout: 60 seconds
```

### 📊 **API Endpoints**

#### **Get Cleanup Statistics**
```http
GET /api/cleanup-stats
```
**Response:**
```json
{
  "success": true,
  "total": 150,
  "active": 25,
  "expired": 5,
  "deleted": 120,
  "nextDeletionDue": "2025-06-24T15:30:00.000Z",
  "cleanupIntervalHours": 1,
  "timestamp": "2025-06-24T14:30:00.000Z"
}
```

#### **Manual Cleanup Trigger**
```http
POST /api/cron/cleanup
```
**Response:**
```json
{
  "success": true,
  "deletedCount": 3,
  "errorCount": 0,
  "deletedFiles": [
    {
      "publicId": "resume_john_doe_1719234567890",
      "filename": "john_doe_resume.pdf",
      "fileType": "generated_pdf",
      "uploadedAt": "2025-06-24T13:30:00.000Z"
    }
  ]
}
```

#### **Delete Specific File**
```http
DELETE /api/cleanup-file/your_public_id
```

#### **Get Recent Uploads**
```http
GET /api/recent-uploads
```

#### **Emergency Cleanup** (Admin)
```http
POST /api/emergency-cleanup
```

### 🛡️ **Security Features**

1. **Database Tracking**: All files tracked with timestamps
2. **Soft Delete**: Files marked as deleted, not removed from DB immediately
3. **Audit Trail**: 7-day retention of deletion records
4. **Error Handling**: Failed deletions tracked and retried
5. **Monitoring**: Recent uploads and stats endpoints

### 📝 **MongoDB Schema**

```javascript
{
  publicId: "resume_john_1719234567890",
  filename: "resume.pdf",
  fileType: "pdf", // pdf, tex, generated_pdf
  cloudinaryUrl: "https://res.cloudinary.com/...",
  uploadedAt: "2025-06-24T13:30:00.000Z",
  scheduledDeletionAt: "2025-06-24T14:30:00.000Z",
  deleted: false,
  deletedAt: null,
  userEmail: "john@example.com" // optional
}
```

### 🔄 **Cron Schedule Options**

| Schedule | Cron Expression | Description |
|----------|----------------|-------------|
| Every hour | `0 * * * *` | **Recommended** |
| Every 30 min | `0,30 * * * *` | More frequent |
| Every 2 hours | `0 */2 * * *` | Less frequent |
| Daily at 2 AM | `0 2 * * *` | Light traffic time |

### 📈 **Monitoring Dashboard**

You can build a simple monitoring dashboard using the API endpoints:

```javascript
// Get live stats
const stats = await fetch('/api/cleanup-stats').then(r => r.json());

// Get recent activity
const recent = await fetch('/api/recent-uploads').then(r => r.json());

// Trigger manual cleanup
const cleanup = await fetch('/api/cron/cleanup', {method: 'POST'}).then(r => r.json());
```

### 🚨 **Troubleshooting**

**Common Issues:**

1. **MongoDB Connection**: Ensure MongoDB is connected
2. **Cloudinary API**: Check Cloudinary credentials
3. **Cron Job Timing**: Verify cron-job.org is hitting your endpoint
4. **Server Timeout**: Increase timeout if many files to delete

**Debug Commands:**
```bash
# Check current stats
curl https://your-domain.com/api/cleanup-stats

# Manual cleanup test
curl -X POST https://your-domain.com/api/cron/cleanup

# Check recent uploads
curl https://your-domain.com/api/recent-uploads
```

### 🎯 **Benefits of This Approach**

✅ **Persistent**: Survives server restarts  
✅ **Reliable**: Database-driven, not memory-based  
✅ **Scalable**: Works with multiple server instances  
✅ **Auditable**: Full tracking and history  
✅ **Serverless**: Perfect for Vercel/Netlify  
✅ **Monitorable**: Rich statistics and reporting  

Your file cleanup system is now enterprise-grade and fully automated! 🚀
