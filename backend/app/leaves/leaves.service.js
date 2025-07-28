const { status } = require("http-status");
const ApiError = require("../../utils/ApiError");
const { Leave } = require("../../utils/mongoose/mongoose");
const { getUserAggregate, userUpdateById } = require("../user/user.service");
const mongoose = require("mongoose");
const { getDateDifferenceInDays } = require("../../config/components/general.methods");
const { sendLeaveEmails, leaveConfirmation, leaveActionEmail, sendLeaveRequestToApprovers } = require("../auth/email.service");
const moment = require("moment");
const { leaveStatus,leavesTypem, scope, leavesType } = require("../../config/enums");
const createLeaveRequest = async (data, user, permission) => {
  const userData = await getUserAggregate({ _id: new mongoose.Types.ObjectId(user.id) }, 1);
  const emails = [];
  if (data.startDate)
    data.startDate = new Date(data.startDate)
  if (data.endDate) data.endDate = new Date(data.endDate);
  const leaveExist = await validateLeaves(data.startDate, data.endDate, user.id);
  if (leaveExist) throw new ApiError(status.BAD_REQUEST, "Leave already exist for these dates");
  if (userData?.organizationData?._id)
    data["organization"] = userData.organizationData._id;
  data["admin"] = userData.adminData ? userData.admin._id : user.id;
  if (userData.clientData) {
    data["client"] = userData.clientData._id;
    emails.push(userData.clientData.email);
  }
  data["userData"] = user;
  data["organizationData"] = userData?.organizationData;
  data["clientData"] = userData?.clientData;

  if (userData?.reportsTo?._id) {
    data["reportTo"] = user.reportsTo._id;
    emails.push(
      userData.reportsTo.email,
    );
  }
  if (userData.hrData) {
    data["hrId"] = userData.hrData._id;
    emails.push(userData.hrData.email);
  }
  const totalDays = getDateDifferenceInDays(new Date(data.startDate), data.endDate);
  const existingLeaves = userData.leaves[data.leaveType] || 0;
  if (totalDays > existingLeaves)
    throw new ApiError(status.BAD_REQUEST, "No leave left for this " + data.type);
  data["totalDays"] = totalDays;
  data["user"] = user.id;
  const result = await Leave.create(data);
  const resultJson = JSON.parse(JSON.stringify(result));
  const emailData = {
    email: resultJson.user.email,
    name: resultJson.user.firstName,
    startDate: resultJson.startDate,
    endDate: resultJson.endDate,
    leaveType: resultJson.leaveType,
    reason: resultJson.reason,
    // reply: resultJson.reply,
    // approveName: user.firstName,
    organization: resultJson?.organization?.name,
    status: resultJson.status,
    totalDays: resultJson.totalDays,
    id: resultJson.id,
    department: resultJson.user.department,
    role: resultJson.user.jobTitle,
    //  actionBaseUrl: 'https://api.your-app.com/v1/leave/action',
    dashboardUrl: 'https://hr.codetricksolutions.com',
    approverEmails: emails,
    email: user.email
  };
  await leaveActionEmail(emailData);
  await sendLeaveRequestToApprovers(emailData);
  return result;
  // data[]
}

const leaveRequestHandler = async (id, body, user, permission) => {
  const leave = await getLeaveById(id);
  if (!leave)
    throw new ApiError(status.BAD_REQUEST, "Request not found");
  const actionUser = [];
  leave.admin ? actionUser.push(leave.admin.toString()) : null;
  leave.client ? actionUser.push(leave.client.toString()) : null;
  leave.hrId ? actionUser.push(leave.hrId.toString()) : null;
  leave.reportTo ? actionUser.push(leave.reportTo.toString()) : null;

  if (!actionUser.includes(user.id.toString())) {
    throw new ApiError(status.BAD_REQUEST, "You are not authorized to perform this action");
  }
  body["approver"] = user.id;
  if (leave.approver)
    throw new ApiError(status.BAD_REQUEST, "Leave already approved");
  body["approveData"] = user;
  const result = await Leave.findByIdAndUpdate(id, body, { new: true });
  const resultJson = JSON.parse(JSON.stringify(result));
  console.log(resultJson.user);
  const emailData = {
    email: resultJson.user.email,
    name: resultJson.user.firstName,
    startDate: resultJson.startDate,
    endDate: resultJson.endDate,
    leaveType: resultJson.leaveType,
    reason: resultJson.reason,
    reply: resultJson.reply,
    approveName: user.firstName,
    organization: resultJson?.organization?.name,
    status: resultJson.status,
    totalDays: resultJson.totalDays,
    id: resultJson.id,
    department: resultJson.user.department,
    role: resultJson.user.jobTitle,
    icons: {
      approved: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yLjI1IDEyYzAtNS4zODUgNC4zNjUtOS43NSA5Ljc1LTkuNzVzOS43NSA0LjM2NSA5Ljc1IDkuNzVzLTQuMzY1IDkuNzUtOS43NSA5Ljc1UzIuMjUgMTcuMzg1IDIuMjUgMTJ6bTEzLjM2LTIuMDIybC0zLjkxNiAzLjkxNiUyMDUtMi4wNDVhLjc1Ljc1IDAgMCAwLTEuMDYgMS4wNmwzLjQ3IDMuNDdBLjc1Ljc1IDAgMCAwIDEyIDExLjc1bDQuNDUtNC40NWEuNzUuNzUgMCAwIDAtMS4wNi0xLjA2eiIgY2xpcC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==',
      rejected: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yLjI1IDEyYzAtNS4zODUgNC4zNjUtOS43NSA5Ljc1LTkuNzVzOS43NSA0LjM2NSA5Ljc1IDkuNzVzLTQuMzY1IDkuNzUtOS43NSA5Ljc1UzIuMjUgMTcuMzg1IDIuMjUgMTJ6bTEzLjM2LTIuMDIybC0zLjkxNiAzLjkxNiUyMDUtMi4wNDVhLjc1Ljc1IDAgMCAwLTEuMDYgMS4wNmwzLjQ3IDMuNDdBLjc1Ljc1IDAgMCAwIDEyIDExLjc1bDQuNDUtNC40NWEuNzUuNzUgMCAwIDAtMS4wNi0xLjA2eiIgY2xpcC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==',
      pending: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyLjI1Yy01LjM4NSAwLTkuNzUgNC4zNjUtOS43NSA5Ljc1czQuMzY1IDkuNzUgOS43NSA5Ljc1IDkuNzUtNC4zNjUgOS43NS05Ljc1UzE3LjM4NSAyLjI1IDEyIDIuMjV6TTExLjI1IDYuNzVjMCAwLS41Mi4yNi0uNzEuNDVsLS41MiAxLjA0YTguOTUgOC45NSAwIDAgMC0zLjI5IDIuNDlsLS43NS43NWEuNzUuNzUgMCAwIDAgMCAxLjA2bDcuNSAzLjc1YS43NS43NSAwIDAgMCAuNzUtLjc1VjguMjVhLjc1Ljc1IDAgMCAwLS43NS0uNzVoLTMuNTh6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIC8+PC9zdmc+'
    },
    dashboardUrl: 'https://hr.codetricksolutions.com',
    email: leave.user.email
  };
  await leaveActionEmail(emailData);
  const updateLeaves = JSON.parse(JSON.stringify(user.leaves));
  updateLeaves[leave.leaveType] -= leave.totalDays;
  await userUpdateById(leave.user.id, { leaves: updateLeaves });
  return result;
}

const getAllLeave = async (filter, options, user, permission) => {
  const addFilter = getAllLeavesValidations(user, permission);
  if (addFilter) Object.assign(filter, addFilter);
  return await Leave.paginate(filter, options);
}

const getLeaveById = async (id) => {
  return await Leave.findById(id);
}
const deleteLeaveRequest = async (id, user, permission) => {
  const leave = await getLeaveById(id);
  if (!leave)
    throw new ApiError(status.BAD_REQUEST, "Request not found");
  return leave;
}
const validateLeaves = async (startDate, endDate, userId) => {
  startDate = moment(startDate).format("YYYY-MM-DD");
  endDate = moment(endDate).format("YYYY-MM-DD");
  return await Leave.findOne(
    {
      user: userId,
      startDate: {
        $lte: new Date(endDate)
      },
      endDate: {
        $gte: new Date(startDate)
      },
      status: {
        $in: ["approved", "pending"]
      }
    });
}

const getAllLeavesValidations = (user, permission) => {
  if (permission.scope == scope.TEAM) {
    const adminId = user.admin ? user.admin : user.id
    return { admin: adminId }
  }
  if (permission.scope == scope.ORGANIZATION) {
    return { organization: user.organization.id }
  }
  if (permission.scope == scope.OWN) {
    return { user: user.id }
  }
}

module.exports = {
  createLeaveRequest,
  leaveRequestHandler,
  getAllLeave,
  getLeaveById,
  deleteLeaveRequest,

}

