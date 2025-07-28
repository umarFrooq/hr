const multer = require("multer");
const config = require(".././config/config");
var multerS3 = require('multer-s3');
const ApiError = require("../utils/ApiError");

const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  accessKeyId: config.aws.awsAccessKeyId,
  secretAccessKey: config.aws.awsSecretAccesskey,
  region: config.aws.awsRegion,

})

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "video/quicktime": "mov",
  "video/mp4": "mp4",
  "application/pdf": "pdf",

};


const videoMimeTypes = ["mov", "mp4"];
const pdfMimeTypes = ["pdf"];
const storage = multerS3({
  limits: 500000,
  acl: "public-read",
  s3,
  bucket: config.aws.awsBucketName,

  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    let isValid = MIME_TYPE_MAP[file.mimetype];
    if (!isValid || (videoMimeTypes.includes(isValid) && !videoEnum.includes(file.fieldname)))
      isValid = null;
    if (!isValid || (pdfMimeTypes.includes(isValid) && !pdfEnums.includes(file.fieldname)))
      isValid = null;
    let error = new ApiError(400, "Invalid mime type");
    if (isValid) {
      error = null;
      cb(null, { fieldName: file.fieldname });
    }
    cb(error);

  },
  key: function (req, file, cb) {
    let removeSpecialCharacters = file.originalname.toLowerCase().replace(/[^A-Z0-9.]+/ig, "-");
    const name = Date.now() + removeSpecialCharacters;
    const ext = MIME_TYPE_MAP[file.mimetype];

    cb(null, name);
  },
});


var uploadImages = multer({
  storage: storage,
  limits: { fieldSize: 8 * 1024 * 1024 },
}).fields([
  { name: "logo", maxCount: 1 },
]);


const videoEnum = ["videoUrl", "inspectionVideo"];
const pdfEnums = ['valuation', 'evaluation', 'inspection'];
// Helper function to format multiple field uploads

module.exports = {
  uploadImages,
  
};


