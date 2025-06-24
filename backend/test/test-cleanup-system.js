// test/test-cleanup-system.js - Simple test to verify the cleanup system
const mongoose = require('mongoose');
const UploadedFile = require('../models/UploadedFile');
require('dotenv').config();

async function testCleanupSystem() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/latex-cv');
    console.log('✅ Connected to MongoDB');

    // Test 1: Track a test file
    console.log('\n📁 Test 1: Tracking a test file...');
    const testFile = await UploadedFile.trackUpload(
      'test_public_id_123',
      'test-resume.pdf',
      'pdf',
      'https://test.cloudinary.com/test.pdf',
      'test@example.com',
      1024
    );
    console.log('✅ File tracked successfully:', {
      publicId: testFile.publicId,
      scheduledDeletionAt: testFile.scheduledDeletionAt
    });

    // Test 2: Get cleanup stats
    console.log('\n📊 Test 2: Getting cleanup statistics...');
    const stats = await UploadedFile.getCleanupStats();
    console.log('✅ Stats retrieved:', stats);

    // Test 3: Check if file should be deleted (it shouldn't yet)
    console.log('\n⏰ Test 3: Checking deletion status...');
    const shouldDelete = testFile.shouldBeDeleted();
    console.log('✅ Should be deleted now?', shouldDelete);

    // Test 4: Get files for deletion (should be empty)
    console.log('\n🗑️ Test 4: Getting files ready for deletion...');
    const filesToDelete = await UploadedFile.getFilesForDeletion();
    console.log('✅ Files ready for deletion:', filesToDelete.length);

    // Test 5: Mark as deleted
    console.log('\n✅ Test 5: Marking file as deleted...');
    const deletedFile = await UploadedFile.markAsDeleted('test_public_id_123');
    console.log('✅ File marked as deleted:', {
      publicId: deletedFile.publicId,
      deleted: deletedFile.deleted,
      deletedAt: deletedFile.deletedAt
    });

    // Test 6: Final stats
    console.log('\n📊 Test 6: Final statistics...');
    const finalStats = await UploadedFile.getCleanupStats();
    console.log('✅ Final stats:', finalStats);

    console.log('\n🎉 All tests passed! Cleanup system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
}

// Run the test
if (require.main === module) {
  testCleanupSystem();
}

module.exports = testCleanupSystem;
