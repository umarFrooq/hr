const { responseMethod } = require('../utils/generalDB.methods.js/DB.methods');
const AWS = require('aws-sdk');
const fs = require('fs');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');

const bucket = new AWS.S3({
  accessKeyId: config.aws.awsAccessKeyId,
  secretAccessKey: config.aws.awsSecretAccesskey,
  region: config.aws.awsRegion,
});

/**
 * S3 utils for uploading, deletion etc of files
 * @returns {Object<ResponseMethod>} --{status,data,message,isSuccess}
 */
class S3Util {
  constructor(fileName, filePath, buffer) {
    this.fileName = fileName;
    this.filePath = filePath;
    this.buffer = buffer;
    this.params = {
      ACL: "public-read",
      Bucket: config.aws.awsBucketName,
      Key: this.extractS3Key(fileName), // Extract key from URL if it's a full URL
    }
  }

  /**
   * Extract S3 key from full URL or return the key as is
   * @param {string} fileNameOrUrl - Either a full S3 URL or just the key
   * @returns {string} - S3 object key
   */
  extractS3Key(fileNameOrUrl) {
    if (!fileNameOrUrl) return null;

    try {
      // If it's already just a key (no http/https), return as is
      if (!fileNameOrUrl.includes('http')) {
        return fileNameOrUrl;
      }

      // Handle different S3 URL formats
      const bucketName = config.aws.awsBucketName;

      // Format 1: https://bucket.s3.region.amazonaws.com/key
      if (fileNameOrUrl.includes(`${bucketName}.s3.`) && fileNameOrUrl.includes('amazonaws.com/')) {
        const parts = fileNameOrUrl.split('amazonaws.com/');
        if (parts.length > 1) {
          return parts[1];
        }
      }

      // Format 2: https://s3.region.amazonaws.com/bucket/key
      if (fileNameOrUrl.includes('s3.') && fileNameOrUrl.includes(`amazonaws.com/${bucketName}/`)) {
        const parts = fileNameOrUrl.split(`amazonaws.com/${bucketName}/`);
        if (parts.length > 1) {
          return parts[1];
        }
      }

      // Format 3: https://bucket.s3.amazonaws.com/key (without region)
      if (fileNameOrUrl.includes(`${bucketName}.s3.amazonaws.com/`)) {
        const parts = fileNameOrUrl.split(`${bucketName}.s3.amazonaws.com/`);
        if (parts.length > 1) {
          return parts[1];
        }
      }

      // Try to extract from URL object as fallback
      const urlObj = new URL(fileNameOrUrl);
      let pathname = urlObj.pathname;

      // Remove leading slash
      if (pathname.startsWith('/')) {
        pathname = pathname.substring(1);
      }

      // If the pathname starts with bucket name, remove it
      if (pathname.startsWith(`${bucketName}/`)) {
        pathname = pathname.substring(`${bucketName}/`.length);
      }

      return pathname;

    } catch (error) {
      console.error('Error extracting S3 key from URL:', error);
      // If URL parsing fails, assume it's already a key
      return fileNameOrUrl;
    }
  }

  // Upload file to S3
  uploadToS3() {
    try {
      // File reading 
      if (this.filePath) {
        let file = fs.readFileSync(this.filePath, "utf8");
        this.params["Body"] = file;
      }
      else if (this.buffer) {
        this.params["Body"] = this.buffer;
      }

      //Uploading file to S3
      const uploaded = new Promise((resolve, reject) => {
        bucket.upload(this.params, async (err, data) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            // remove file from local directory after upload
            if (this.filePath) {
              fs.truncateSync(this.filePath);
            }

            resolve(data.Location);
          }
        });
      });

      return uploaded.then(data => {
        return responseMethod(200, true, "uploaded successfully", data);
      }).catch(err => {
        return responseMethod(400, false, err, null);
      })
    } catch (err) {
      return responseMethod(400, false, err, null);
    }
  }

  // Delete file from S3
  deleteFromS3() {
    // Valid media name
    if (this.params.Key) {
      console.log(`Attempting to delete S3 object with key: ${this.params.Key}`);
      console.log(`From bucket: ${this.params.Bucket}`);

      // Remove extra keys for deletion
      const deleteParams = {
        Bucket: this.params.Bucket,
        Key: this.params.Key
      };

      // Remove file from S3 Promise
      return new Promise((resolve, reject) => {
        bucket.deleteObject(deleteParams, function (err, data) {
          // S3 Error handling
          if (err) {
            console.error("Error deleting from S3:", err);
            reject(err);
          } else {
            console.log("Successfully deleted file from bucket");
            console.log("Delete response:", data);
            resolve(data);
          }
        });
      }).then(result => {
        return result;
      }).catch(err => {
        throw new ApiError(400, err.message);
      })
    } else {
      throw new ApiError(400, "File name is required");
    }
  }

  // Delete multiple files from S3
  deleteManyFromS3() {
    if (this.params.Key) {
      // AWS deletion Object
      this.params["Delete"] = { Objects: this.params.Key };

      // Remove extra keys
      delete this.params.Key;
      delete this.params.ACL
      console.log(JSON.stringify(this.params))
      // Remove file from S3 Promise
      return new Promise((resolve, reject) => {
        bucket.deleteObjects(this.params, function (err, data) {
          // S3 Error handling
          if (err) reject(err);
          else
            console.log("Successfully deleted file from bucket");
          resolve(data);
        });
      }).then(result => {
        return result;
      }).catch(err => {
        return responseMethod(400, false, err.message, null);
      })
    } else return responseMethod(400, false, "File name is required", null);
  }

  /**
   * Check if an object exists in S3 (for debugging)
   * @returns {Promise<boolean>}
   */
  async checkIfExists() {
    try {
      await bucket.headObject({
        Bucket: this.params.Bucket,
        Key: this.params.Key
      }).promise();
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw error;
    }
  }
}

module.exports = S3Util;