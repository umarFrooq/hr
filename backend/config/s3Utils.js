const S3_endpoint = "https://s3.amazonaws.com";
const s3Config = require("./config")
var multer = require('multer');
var multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    accessKeyId: s3Config.s3Bucket.accessKey,
    secretAccessKey: s3Config.s3Bucket.secretKey,
    region: s3Config.s3Bucket.region,
})
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};
var upload = multer({
    storage: multerS3({
        acl: "public-read",
        s3: s3,
        bucket: s3Config.s3Bucket.bucketName,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            const isValid = MIME_TYPE_MAP[file.mimetype];
            let error = new Error("Invalid format. Only png,jpeg and jpg allowed.");
            if (isValid) {
                error = null;
                cb(null, { fieldName: file.fieldname });
            }
            cb(error);

            // console.log(file)
            // cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            console.log(this.metadata);
            const name = file.mimetype.split("/");
            const ext = name[1];
            // const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, Date.now().toString() + "." + ext)
        }
    })
})

const deleteFile = async (fileName) => {
    const params = {
        Bucket: s3Config.s3Bucket.bucketName,
        Key: fileName
    };
    return await s3.deleteObject(params, function (err, data) {
        if (err) {
            return { isError: true, error: err, message: "S3 delete file Error" };
        } else {
            return { isError: false, error: {}, message: "S3 delete file successfuly" };
        }
    });
}



module.exports = { upload, deleteFile };