const { default: status } = require("http-status");
const ApiError = require("../../utils/ApiError");
const { Checkin } = require("../../utils/mongoose/mongoose");
const { getUserById } = require("../user/user.service");
const { responseMessages } = require("../../utils/response.message");
const { SelectObjectContentOutputFilterSensitiveLog } = require("@aws-sdk/client-s3");
const { scope } = require("../../config/enums");
const { dateFilter } = require("../../config/components/general.methods");

const createCheckin = async (data, user, permission) => {
  const getUser = await getUserById(data.user);
  if (!getUser) throw new ApiError(status.BAD_REQUEST, responseMessages.USER_NOT_FOUND);
  createCheckinValidation(user, data, permission, getUser);
  data["organizationName"] = getUser?.organizationData?.name;
  data["organizationId"] = getUser?.organizationData?.id;
  data["name"] = getUser.lastName + getUser.lastName;;
  data["email"] = getUser.lastName;
  data["reportsTo"] = getUser?.reportsTo;
  data["lastName"] = getUser.lastName;
  data["clientId"] = getUser.client;
  data["admin"] = getUser.admin;
  data["employeeId"] = getUser.employeeId;
  if (getUser.client) {
    const getClient = await getUserById(getUser.client);
    data["client"] = { name: getClient.firstName + getClient.lastName, email: getClient.email };
  }
  if (getUser.reportsTo) {
    data["reportsTo"] = getUser.reportsTo;
  }
  const checkin = await Checkin.create(data);
  return checkin;
}

const updateCheckIn = async (id, data, user, permission) => {
  const getUser = await getUserById(data.user);
  if (!getUser) throw new ApiError(status.BAD_REQUEST, responseMessages.USER_NOT_FOUND);
  createCheckinValidation(user, data, permission, getUser);
  const checkin = await Checkin.findByIdAndUpdate(id, data);
  return checkin;
}

const getAllCheckIn = async (filter, options, search, user, permission) => {
  if (!filter.to && !filter.from)
    Object.assign(filter, { createdAt: { $lte: new Date() } });
  else dateFilter(filter);
  if (filter.reportsTo) {
    const reportsTo = filter.reportsTo
    delete reportsTo;
    filter["reportsTo.id"] = filter.reportsTo;
  }
  const newFilter = allCheckInValidations(user, permission);
  if (newFilter) Object.assign(filter, newFilter);
  return await Checkin.paginate(filter, options);
}
const getCheckInById = async (id) => {
  return await Checkin.findById(id);
}

const createCheckinValidation = (user, data, permission, getUser) => {
  if (permission.scope == scope.TEAM) {
    if (permission.admin) {
      if (!getUser.admin.toString() == user.admin)
        throw new ApiError(status.FORBIDDEN, responseMessages.FORBIDDEN);
    }
  }
  if (permission.scope == scope.ORGANIZATION) {
    if (user?.organizationData?.id.toString() != getUser?.organizationData?.id.toString())
      throw new ApiError(status.FORBIDDEN, responseMessages.FORBIDDEN);
  }
}

const allCheckInValidations = (user, pemission) => {
  if (pemission.scope == scope.TEAM) {
    const admin = user.admin ? user.admin : user.id;
    return { admin };
  }
  if (pemission.scope == scope.ORGANIZATION) {
    return { organizationId: user.organization.id };
  }
  if (pemission.scope == scope.OWN) {
    {
      return { user: user.id };
    }
  }

}


const saveAttendanceLog = async (logData) => {
  // You can extract specific fields as needed
  const attendance = new Attendance({
    userId: logData.UserID || "unknown",
    timestamp: new Date(logData.Time || Date.now()),
    deviceId: logData.DeviceID || "unknown",
    status: logData.Status || "unknown",
    rawData: logData
  });

  await attendance.save();
};

module.exports = {
  saveAttendanceLog,
};

let filterCheckin = async(filter)=>{
  return await Checkin.findOne(filter)
}

const bioMetricCheckin = async (bioData) => {
  console.log("bio dataaaaaaaaaaaa",bioData)
  // let data={}
  // const getUser = await getUserById(data.user);
  // data["organizationName"] = getUser?.organizationData?.name;
  // data["organizationId"] = getUser?.organizationData?.id;
  // data["name"] = getUser.lastName + getUser.lastName;;
  // data["email"] = getUser.lastName;
  // data["reportsTo"] = getUser?.reportsTo;
  // data["lastName"] = getUser.lastName;
  // data["clientId"] = getUser.client;
  // data["admin"] = getUser.admin;
  // data["employeeId"] = getUser.employeeId;
  // if (getUser.client) {
  //   const getClient = await getUserById(getUser.client);
  //   data["client"] = { name: getClient.firstName + getClient.lastName, email: getClient.email };
  // }
  // if (getUser.reportsTo) {
  //   data["reportsTo"] = getUser.reportsTo;
  // }
  const checkin = await Checkin.create({data:bioMetricCheckin});
  return checkin;
}
module.exports = {
  createCheckin,
  updateCheckIn,
  getAllCheckIn,
  getCheckInById,
  bioMetricCheckin,
filterCheckin

}