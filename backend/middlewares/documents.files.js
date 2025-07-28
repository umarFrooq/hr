const multer = require("multer");
const config = require("../config/config");
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid'); // <-- CRITICAL: Import uuid
const path = require('path');           // <-- CRITICAL: Import path

// Use the same S3 client configuration that you know works
const s3 = new S3Client({
  accessKeyId: config.aws.awsAccessKeyId,
  secretAccessKey: config.aws.awsSecretAccesskey,
  region: config.aws.awsRegion,

})

// 1. Define a NEW storage configuration specifically for this document upload task.
//    This keeps concerns separate from your image uploads.
const documentsStorage = multerS3({
  s3: s3,
  bucket: config.aws.awsBucketName,
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,

  /**
   * The metadata function tailored for the custom names requirement.
   */
  metadata: function (req, file, cb) {
    const fileIndex = req.files ? req.files.length : 0;
    const customNames = req.body.customNames;
    let customName = 'Untitled';

    if (customNames) {
      if (Array.isArray(customNames)) {
        customName = customNames[fileIndex] || 'Untitled';
      } else {
        // This handles the case of only one file being uploaded
        customName = customNames;
      }
    }
    // On success, call the callback with null for the error and the metadata object.
    cb(null, { 'name': customName });
  },

  /**
   * The key function to generate a unique filename for S3.
   */
  key: function (req, file, cb) {
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    // Best practice: Use a unique ID to prevent filename collisions.
    const fileName = `documents/${uniqueId}${extension}`;
    cb(null, fileName);
  }
});

// 2. Create the multer instance using the new storage configuration.
//    You will call `.array('files')` on this instance directly in your route.
const uploadMultipleDocuments = multer({
  storage: documentsStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // Example: 10MB file size limit
});

// 3. Export the multer instance.
module.exports = {
  uploadMultipleDocuments
};