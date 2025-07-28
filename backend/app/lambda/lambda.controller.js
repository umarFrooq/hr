const cronService = require("./lambda.service");

exports.attendanceCheck = async (req, res) => {
  try {
    // Optional: secure with header secret
    // const secretKey = req.headers["x-cron-secret"];
    // if (secretKey !== process.env.CRON_SECRET) {
    //   return res.sendStatus(null,403,"Unauthorized");
    // }

    const result = await cronService.handleAttendanceCheck();
    res.sendStatus(result);
  } catch (error) {
    console.error(" Controller error:", error);
    res.sendStatus(null ,500,"Server error" );
  }
};
