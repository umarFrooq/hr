const express = require("express");
const router = express.Router();
let lambdaAuth =require('../../middlewares/lambda.auth')
const cronController = require("./lambda.controller");

// router.post("/attendance-check",lambdaAuth, cronController.attendanceCheck);
router.get("/attendance-check", cronController.attendanceCheck);


module.exports = router;
