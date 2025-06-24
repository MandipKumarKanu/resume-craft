const UploadedFile = require("../models/UploadedFile");
const cloudinary = require("../utils/cloudinary");

class FileCleanupService {
  constructor() {
    console.log("Database-driven file cleanup service initialized");
  }

  async trackFile(
    publicId,
    filename,
    fileType,
    cloudinaryUrl,
    userEmail = null,
    fileSize = null
  ) {
    try {
      const fileRecord = await UploadedFile.trackUpload(
        publicId,
        filename,
        fileType,
        cloudinaryUrl,
        userEmail,
        fileSize
      );

      return fileRecord;
    } catch (error) {
      console.error("Error tracking file:", error);
      throw error;
    }
  }

  async performCleanup() {
    try {
      console.log("Starting automated file cleanup process...");

      const filesToDelete = await UploadedFile.getFilesForDeletion();

      if (filesToDelete.length === 0) {
        console.log("No files to delete");
        return {
          success: true,
          deletedCount: 0,
          errors: [],
          message: "No files needed deletion",
        };
      }

      console.log(`🗑️ Found ${filesToDelete.length} files to delete`);

      const deletedFiles = [];
      const errors = [];

      for (const file of filesToDelete) {
        try {
          await cloudinary.uploader.destroy(file.publicId, {
            resource_type: "raw",
          });

          await UploadedFile.markAsDeleted(file.publicId);

          deletedFiles.push({
            publicId: file.publicId,
            filename: file.filename,
            fileType: file.fileType,
            uploadedAt: file.uploadedAt,
            scheduledDeletionAt: file.scheduledDeletionAt,
          });

          console.log(`✅ Deleted: ${file.publicId} (${file.fileType})`);
        } catch (error) {
          console.error(`❌ Failed to delete ${file.publicId}:`, error.message);
          errors.push({
            publicId: file.publicId,
            error: error.message,
          });
        }
      }

      const result = {
        success: true,
        deletedCount: deletedFiles.length,
        errorCount: errors.length,
        deletedFiles,
        errors,
        message: `Successfully deleted ${deletedFiles.length} files${
          errors.length > 0 ? `, ${errors.length} errors` : ""
        }`,
      };

      console.log(
        `🎯 Cleanup completed: ${deletedFiles.length} deleted, ${errors.length} errors`
      );

      return result;
    } catch (error) {
      console.error("❌ Cleanup process failed:", error);
      return {
        success: false,
        error: error.message,
        message: "Cleanup process failed",
      };
    }
  }

  async emergencyCleanup() {
    try {
      console.log("🚨 EMERGENCY CLEANUP: Deleting all tracked files...");

      const allFiles = await UploadedFile.find({ deleted: false });
      const deletedCount = allFiles.length;

      for (const file of allFiles) {
        try {
          await cloudinary.uploader.destroy(file.publicId, {
            resource_type: "raw",
          });
          await UploadedFile.markAsDeleted(file.publicId);
        } catch (error) {
          console.error(
            `❌ Emergency delete failed for ${file.publicId}:`,
            error.message
          );
        }
      }

      console.log(
        `🚨 Emergency cleanup completed: ${deletedCount} files processed`
      );

      return {
        success: true,
        deletedCount,
        message: "Emergency cleanup completed",
      };
    } catch (error) {
      console.error("❌ Emergency cleanup failed:", error);
      throw error;
    }
  }
}

const fileCleanupService = new FileCleanupService();

module.exports = fileCleanupService;
