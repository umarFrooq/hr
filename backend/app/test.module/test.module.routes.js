const express = require("express");
const router = express.Router();
const validate = require("../../middlewares/validate");
const testController = require("./test.module.controller");
const testValidation = require("./test.module.validation")

router.route("/")
  .post(validate(testValidation.createTest), testController.createTest)


module.exports = router;