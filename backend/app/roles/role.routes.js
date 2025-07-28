const express = require("express");
const validate = require("../../middlewares/validate");
const roleValidation = require("./role.validation");
const roleController = require("./role.controller");
const router = express.Router();


router.route("/")
  .post(validate(roleValidation.createRole), roleController.createRole)
  .get(validate(roleValidation.getAllRoles), roleController.getAllRoles);

router.route("/:roleId")
  .get(validate(roleValidation.getRoleById), roleController.getRoleById)
  .patch(validate(roleValidation.updateRoleById), roleController.updateRoleById)
  .delete(validate(roleValidation.getRoleById), roleController.deleteRoleById);

  module.exports = router;