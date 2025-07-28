const express = require("express");
const router = express.Router();
const permissionController = require("./permission.controller");
const permissionValidation = require("./permission.validation");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");

router.route("/")
.post( validate(permissionValidation.createPermission), permissionController.createPermission)
.get( validate(permissionValidation.getAllPermissions), permissionController.getAllPermissions);

router.route("/:permissionId")
.get (validate(permissionValidation.getPermissionById), permissionController.getPermissionById)
.patch( validate(permissionValidation.updatePermissionById), permissionController.updatePermissionById)
.delete( validate(permissionValidation.getPermissionById), permissionController.deletePermissionById);

module.exports = router;