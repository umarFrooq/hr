const passport = require('passport');
const { status } = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const { resourceMethods } = require('../config/enums');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(status.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;
  const resouce = req?.baseUrl.split('/')[2];
  const method = resourceMethods[req.method];
  let permissions = user?.rolePermission?.permissions || [];
  permissions = JSON.parse(JSON.stringify(permissions));
  if (!permissions?.length)
    return reject(new ApiError(status.FORBIDDEN, 'Forbidden'));
  const permission = permissions.find(
    (permission) => permission.resource === resouce && permission.action === method
  );
  if (!permission)
    return reject(new ApiError(status.FORBIDDEN, 'Forbidden'));
  console.log(requiredRights);
  console.log(requiredRights.includes(permission.scope))
  if (!requiredRights.includes(permission.scope))
    return reject(new ApiError(status.FORBIDDEN, 'Forbidden'));
  req["permission"] = permission;
  // if (requiredRights.length) {
  //   const userRights = roleRights.get(user.role);
  //   const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
  //   if (!hasRequiredRights && req.params.userId !== user.id) {
  //     return reject(new ApiError(status.FORBIDDEN, 'Forbidden'));
  //   }
  // }
  console.log(req.permission);
  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => {
      // try{
      //   loger(req, res);
      // }
      // catch(err){ next()}; 
      next()
    })
    .catch((err) => next(err));
};

module.exports = auth;
