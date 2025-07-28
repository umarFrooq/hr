const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('./user.validation');
const userController = require("./user.controller");
const Upload = require("../../middlewares/files");
const { uploadMultipleDocuments } = require('../../middlewares/documents.files');
const router = express.Router();

router
  .route('/')
  .post(auth("any", "team"), validate(userValidation.createUser), userController.createUser)
  .get(auth("any", "team", "org"), validate(userValidation.getUsers), userController.getUsers);
// router.route("/register")
//   .post(validate(userValidation.createUser), userController.createUser)
// router.route("/admin")
//   .get(auth('manageUsers'), validate(userValidation.getAllUsers), userController.getAllUsers)
//   .patch(auth('manageUsers'), validate(userValidation.changePasswordAdmin), userController.changePasswordAdmin)
// router.route("/logo")
//   .post(auth('updateUsers'), Upload.uploadImages, validate(userValidation.uploadLogo), userController.uploadLogo)
// router.route("/all")
//   .patch(auth("manageUsers"), validate(userValidation.updateUsers), userController.updateUsers)
router.route("/:userId/documents")
  .post(auth("any", "team"), uploadMultipleDocuments.array("files"), validate(userValidation.uploadDocuments), userController.uploadDocuments)
router
  .route('/:userId')
  .get(auth('any', "team", "own", "org"), validate(userValidation.getUser), userController.getUser)
  .patch(auth("any", "team"), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth("any", "team"), validate(userValidation.getUser), userController.deleteUser)


router
  .route('/change-password')
  .put(auth("changePassword"), validate(userValidation.changePassword), userController.changePassword)


module.exports = router;