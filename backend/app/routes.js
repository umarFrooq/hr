const express = require("express");
const router = express.Router();
const { version } = require('../package.json');
const config = require("../config/config");

router.get("/health", (req, res) => {
  let response = { version: version }
  if (req.query.debugg == "8494456261") {
    const ip = RequestIp.getClientIp(req);
    response["node_env"] = config.env;
    // user ip
    response["ip"] = ip;
  }

  res.send(response);
});


router.use("/test", require("../app/test.module/test.module.routes"));
router.use("/users", require("../app/user/user.routes"));
router.use("/organizations", require("../app/organization/organization.routes"));
router.use("/auth", require("../app/auth/auth.routes"));
router.use("/permissions", require("../app/permission/permission.routes"));
router.use("/roles", require("../app/roles/role.routes"));
router.use("/checkin", require("../app/checkin/checkin.routes"));
router.use("/leaves", require("../app/leaves/leaves.routes"));

module.exports = router;