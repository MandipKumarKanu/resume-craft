const mongoose = require('mongoose');

const uploadedFileSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  filename: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'tex', 'generated_pdf'],
    required: true
  },
  cloudinaryUrl: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  scheduledDeletionAt: {
    type: Date,
    required: true,
    index: true
  },
  deleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: {
    type: Date,
    default: null
  },
  userEmail: {
    type: String,
    default: null // Optional: track user for analytics
  },
  fileSize: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient cleanup queries
uploadedFileSchema.index({ scheduledDeletionAt: 1, deleted: 1 });

// Static method to track a new upload
uploadedFileSchema.statics.trackUpload = async function(publicId, filename, fileType, cloudinaryUrl, userEmail = null, fileSize = null) {
  const deletionTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  
  const fileRecord = new this({
    publicId,
    filename,
    fileType,
    cloudinaryUrl,
    scheduledDeletionAt: deletionTime,
    userEmail,
    fileSize
  });
  
  await fileRecord.save();
  
  console.log(`📁 Tracked file: ${publicId} (${fileType}) - scheduled for deletion at ${deletionTime.toISOString()}`);
  
  return fileRecord;
};

// Static method to get files ready for deletion
uploadedFileSchema.statics.getFilesForDeletion = async function() {
  const now = new Date();
  
  return await this.find({
    scheduledDeletionAt: { $lte: now },
    deleted: false
  }).sort({ scheduledDeletionAt: 1 });
};

// Static method to mark file as deleted
uploadedFileSchema.statics.markAsDeleted = async function(publicId) {
  return await this.findOneAndUpdate(
    { publicId },
    { 
      deleted: true, 
      deletedAt: new Date() 
    },
    { new: true }
  );
};

// Static method to get cleanup statistics
uploadedFileSchema.statics.getCleanupStats = async function() {
  const now = new Date();
  
  const [total, active, expired, deleted] = await Promise.all([
    this.countDocuments({}),
    this.countDocuments({ deleted: false, scheduledDeletionAt: { $gt: now } }),
    this.countDocuments({ deleted: false, scheduledDeletionAt: { $lte: now } }),
    this.countDocuments({ deleted: true })
  ]);
  
  const oldestActive = await this.findOne(
    { deleted: false, scheduledDeletionAt: { $gt: now } },
    'scheduledDeletionAt'
  ).sort({ scheduledDeletionAt: 1 });
  
  return {
    total,
    active,
    expired,
    deleted,
    nextDeletionDue: oldestActive ? oldestActive.scheduledDeletionAt : null
  };
};

// Instance method to check if file should be deleted
uploadedFileSchema.methods.shouldBeDeleted = function() {
  return !this.deleted && new Date() >= this.scheduledDeletionAt;
};

// Auto-cleanup old records (keep for 7 days after deletion for audit)
uploadedFileSchema.index({ deletedAt: 1 }, { 
  expireAfterSeconds: 7 * 24 * 60 * 60 // 7 days
});

const UploadedFile = mongoose.model('UploadedFile', uploadedFileSchema);

module.exports = UploadedFile;
