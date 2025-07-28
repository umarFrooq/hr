const multer = require("multer");
const limelightUploadUtils  = require("../app/videoupload/upload.utils")

var storage = multer.memoryStorage({
    destination: async function (req, file, cb) {
        console.log()
        console.log(req.file)
        console.log(file.stream);
        await limelightUploadUtils.limelightUploadingUtils(file);
        cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
console.log(storage)
var upload = multer({ storage: storage })

module.exports = {upload}
