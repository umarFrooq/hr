const router = require("express").Router();
const orginizationController = require("./organization.controller");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const orginizationValidation = require("./organization.validation");
const { uploadImages } = require("../../middlewares/files");

router.route("/")
  .post(auth("any","team","org"), validate(orginizationValidation.createOrginization), orginizationController.createOrginization)
  .get(auth("any","team","org","own"), validate(orginizationValidation.getAllOrginizations), orginizationController.getAllOrginizations);

router.route("/:organizationId")
  .get(auth("any","team","org","own"), validate(orginizationValidation.getOrginizationById), orginizationController.getOrginizationById)
  .patch(auth("any","team","org"), validate(orginizationValidation.updateOrginizationById), orginizationController.updateOrginizationById)
  .delete(auth("any","team","org"), validate(orginizationValidation.getOrginizationById), orginizationController.deleteOrginizationById)
  .post(auth("any","team","org"),uploadImages, validate(orginizationValidation.uploadLogo), orginizationController.uploadLogo);

module.exports = router;