const aws = require("aws-sdk");
const config = require("./config");
const fs = require("fs");
const path = require("path");
// const checkMulterParams = require("./check-multer-params");

aws.config.setPromisesDependency();
aws.config.update({
  // accessKeyId: config.aws.awsAccessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

const getParams = (folderName, multerParamsObject) => {
  return {
    ACL: "public-read",
    Bucket: config.aws.awsBucketName,
    Body: fs.createReadStream(multerParamsObject.filePath),
    Key: `${folderName}/${multerParamsObject.filename}`,
  };
};

const uploadToS3 = ({ file, folderName }) =>
  new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("File required"));
    }
    const s3 = new aws.S3();
    let multerCheckReturnValue = checkMulterParams(file); // value returned after multer params are checked
    const paramsArray = [];
    if (Array.isArray(file)) {
      for (let item of multerCheckReturnValue) {
        const params = getParams(folderName, item);
        s3.upload(params, (err, data) => {
          if (err) {
            reject(err);
          }

          if (data) {
            fs.unlinkSync(path.join(item.filePath));
            paramsArray.push(data.Location);
            if (paramsArray.length === multerCheckReturnValue.length) {
              // Don't resolve until all uploads have been completed.
              resolve(paramsArray);
            }
          }
        });
      }
    } else {
      const params = getParams(folderName, multerCheckReturnValue);

      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        }

        if (data) {
          fs.unlinkSync(path.join(multerCheckReturnValue.filePath));
          resolve(data.Location);
        }
      });
    }
  });

const deleteFromS3 = (file) => {
  new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("File path required"));
    }
    const s3 = new aws.S3();
    if (Array.isArray(file)) {
      var objects = [];
      for (var k in file) {
        objects.push({ Key: file[k] });
      }

      var deleteParam = {
        Bucket: config.aws.awsBucketName,
        Delete: { Objects: objects },
      };
      s3.deleteObjects(deleteParam, function (err, data) {
        if (err) reject(err);
        if (data) {
          resolve(data);
        }
      });
    } else {
      var deleteParam = {
        Bucket: config.aws.awsBucketName,
        Key: file,
      };
      s3.deleteObject(deleteParam, function (err, data) {
        if (err) reject(err);
        if (data) {
          resolve(data);
        }
      });
    }
  });
};

module.exports = {
  uploadToS3,
  deleteFromS3,
};
