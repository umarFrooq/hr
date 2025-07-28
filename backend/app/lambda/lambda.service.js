const moment = require("moment");
// const User = require("../user/user.model");
const checkinservice = require("../checkin/checkin.service");
const LeaveRequest = require("../leaves/leaves.model");

let {filterUsers}=require('../user/user.service')
exports.handleAttendanceCheck = async (event) => {
  const User = require("../user/user.model");
  const todayStart = moment().startOf("day").toDate();
  const todayEnd = moment().endOf("day").toDate();
  const cutoffTime = moment().hour(13).minute(0).second(0); // 1:00 PM

  //  const [startHour, startMinute] = org.startTime.split(":").map(Number);
  // const [endHour, endMinute] = org.endTime.split(":").map(Number);
  // const [cutoffHour, cutoffMinute] = org.cutoffTime.split(":").map(Number);

  const users = await filterUsers({ isActive: true })
  let updatedUsers = [];

  for (const user of users) {
    let checkin = await checkinservice.filterCheckin({
      user: user._id,
      checkin: { $gte: todayStart, $lte: todayEnd },
    });

    const leave = await LeaveRequest.findOne({
      user: user._id,
      status: "approved",
      startDate: { $lte: todayEnd },
      endDate: { $gte: todayStart },
    });

    let action = "";

    if (checkin) {
      const checkinTime = moment(checkin.checkin);
      if (checkinTime.isAfter(cutoffTime)) {
        if (user.remaingLeaves >= 0.5) {
          user.remaingLeaves -= 0.5;
          action = "half day leave deducted (late check-in)";
        } else {
          const halfDaySalary = user.salary / 30 / 2;
          user.totalSalary -= halfDaySalary;
          action = "half day salary deducted (late check-in)";
        }
        await user.save();
        updatedUsers.push({ userId: user._id, email: user.email, action });
      }
      continue;
    }

    if (leave) {
      if (leave.isHalfDay) {
        if (user.remaingLeaves >= 0.5) {
          user.remaingLeaves -= 0.5;
          action = "half day leave deducted (approved leave)";
        } else {
          const halfDaySalary = user.salary / 30 / 2;
          user.totalSalary -= halfDaySalary;
          action = "half day salary deducted (approved leave)";
        }
      } else {
        if (user.remaingLeaves > 0) {
          user.remaingLeaves -= 1;
          action = "full day leave deducted (approved leave)";
        } else {
          const dailySalary = user.salary / 30;
          user.totalSalary -= dailySalary;
          action = "full day salary deducted (approved leave)";
        }
      }
      await user.save();
      updatedUsers.push({ userId: user._id, email: user.email, action });
      continue;
    }

    // No checkin and no leave → Absent
    if (user.remaingLeaves > 0) {
      user.remaingLeaves -= 1;
      action = "full day leave deducted (absent)";
    } else {
      const dailySalary = user.salary / 30;
      user.totalSalary -= dailySalary;
      action = "full day salary deducted (absent)";
    }
    await user.save();
    updatedUsers.push({ userId: user._id, email: user.email, action });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Attendance check complete", updatedUsers }),
  };
};
