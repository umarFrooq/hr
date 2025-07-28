/**
 * Vintega Solutions
 *
 * User Controller, it encapsulates all user related methods.
 * These methods are called via API endpoints. Some endpoints may require admin level authorization.
 * 
 * @summary User Controller, called via API endpoints
 * @author Asad Ahmed
 *
 * Created at     : 2020-08-03 13:52:11 
 * Last modified  : 2020-08-03 14:01:18
 */


/**
 * @function getUsers //called via API endpoint
 *
 * @param {*} req // Query and body parameters
 * @param {*} res // API Response
 * @param {*} next // not used at the moment
 * @returns API Response
 */
//TODO: Document all methods and correct response messages accordingly

const { status } = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const userService = require('./user.service');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body, req.user, req.permission);
  res.sendStatus(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['role', "employeeId", "email", "phone", "department", "role", "organization", "admin", "reportsTo", "to", "from", "client"]);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const search = pick(req.query, ['value', 'name']);
  const result = await userService.getAllUsersAtlas(filter, options, req.user, req.permission, search);
  res.sendStatus(result);
});



const getUser = catchAsync(async (req, res) => {

  const user = await userService.findUserById(req.params.userId, req.user);
  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'USER_NOT_FOUND');
  }
  res.sendStatus(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body, req.user, req.permission);
  res.sendStatus(user);
});


const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.sendStatus(null, status.NO_CONTENT);
});

const changePassword = catchAsync(async (req, res) => {
  const user = await userService.changePassword(req.user, req.body);
  res.status(status.OK).send(user);
});
const changePasswordAdmin = catchAsync(async (req, res) => {
  const user = await userService.changePasswordAdmin(req.user, req.body);
  res.status(status.OK).send(user);
});

const getAllUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['fullname', 'email', 'to', 'from', 'role', 'city']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const search = pick(req.query, ['name', 'value']);
  const result = await userService.getAllUsers(filter, options, search);
  res.sendStatus(result);
});

const uploadLogo = catchAsync(async (req, res) => {
  const result = await userService.uploadLogo(req.files, req.user, req.body);
  res.sendStatus(result);
})

const updateUsers = catchAsync(async (req, res) => {
  const result = await userService.updateUsers(req.body)
  res.sendStatus(result);
})

const uploadDocuments = catchAsync(async (req, res) => {
  console.log(JSON.stringify(req.files));
  const result = await userService.uploadDocuments(req.user, req.params.userId, req.files, req.body);
  res.sendStatus(result);
})
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
  getAllUsers,
  changePasswordAdmin,
  uploadLogo,
  updateUsers,
  uploadDocuments
};
