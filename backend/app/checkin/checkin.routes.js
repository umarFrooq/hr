const express = require("express");
const router = express.Router();
const checkinController = require("./checkin.controller");
const checkinValidation = require("./checkin.validation");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");

router.route("/")
  .post(auth("any", "team", "org"), validate(checkinValidation.createCheckin), checkinController.createCheckin)
  .get(auth("any", "team", "own", "org"), validate(checkinValidation.getAllCheckIn), checkinController.getAllCheckIn);
 router.route("/biometric") .post( checkinController.bioMetricCheckin)

router.route("/:checkinId")
  .get(auth("any", "team", "own", "org"), validate(checkinValidation.getCheckin), checkinController.getCheckIn)
  .patch(auth("any", "team", "org"), validate(checkinValidation.updateCheckin), checkinController.updateCheckIn)
// .delete(auth("any", "team", "own", "org"), validate(checkinValidation.getCheckIn), checkinController.deleteCheckIn);

module.exports = router;