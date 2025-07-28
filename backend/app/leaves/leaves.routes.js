const express = require("express");
const router = express.Router();
const leavesController = require("./leaves.controller");
const leavesValidation = require("./leaves.validation");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");

router.route("")
  .post(auth("any", "team", "org", "own"), validate(leavesValidation.createLeaveRequest), leavesController.createLeaveRequest)
  .get(auth("any", "team", "own", "org"), validate(leavesValidation.getAllLeaveRequests), leavesController.getAllLeaveRequests)

router.route("/:leaveId")
  .get(auth("any", "team", "own", "org"), validate(leavesValidation.getLeaveById), leavesController.getLeaveById)
  .patch(auth("any", "team", "org"), validate(leavesValidation.leaveRequestHandler), leavesController.updateLeaveRequest)
  .delete(auth("any", "team", "org", "own"), validate(leavesValidation.getLeaveById), leavesController.deleteLeaveRequest)

module.exports = router;