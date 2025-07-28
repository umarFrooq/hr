const {status} = require("http-status");
const userService = require("../user/user.service");
const tokenService = require("./token.service");
const db = require('../../utils/mongoose/mongoose');
const ApiError = require("../../utils/ApiError");
const { tokenTypes } = require("../../config/token");
const Token = db.Token;
const User = db.User;

const { roleTypes, allowedAdminPannel } = require("../../config/enums");
const { responseMethod } = require("../../utils/generalDB.methods.js/DB.methods");
const crypto = require('crypto-js');
// const { sendEmailVerifemail } = require('../auth/email.service')
// const { getCache, setCache } = require('../../utils/cache/cache')
const { slugGenerator } = require('../../config/components/general.methods');
const { responseMessages, projectModules } = require("../../utils/response.message");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */

async function loginUserWithEmailAndPassword(email, password) {
  const user = await userService.getUserByEmailAndRole(email, [{ role: { $in: Object.values(roleTypes) } }]);

  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(status.UNAUTHORIZED, `AUTH_MODULE.LOGIN.INVALID_EMAIL_PASSWORD`);      // example to consider
  }
  return user;
}

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */

async function loginWithEmailAndPassword(email, password) {
  const user = await User.findOne({email});
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(status.UNAUTHORIZED, "AUTH_MODULE.LOGIN.INVALID_EMAIL_PASSWORD");      // example to consider
  }
  return user;
}

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(status.BAD_REQUEST, 'AUTH_MODULE.LOGOUT.REFRESH_TOKEN_NOT_EXIST');
  }
  // await removeToken(refreshTokenDoc.user);
  await Token.findByIdAndRemove(refreshTokenDoc._id);
};
/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
async function refreshAuth(refreshToken) {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    if (!refreshTokenDoc)
      throw new ApiError(400, 'AUTH_MODULE.TOKEN.TOKEN_VERIFICATION_FAILED')
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new ApiError(400, 'AUTH_MODULE.TOKEN.USER_NOT_FOUND');
    }
    const token = await tokenService.getOneToken({ user: user.id, type: tokenTypes.REFRESH, token: refreshToken, expires: { $gte: new Date() } });
    if (!token) throw new ApiError(400, 'AUTH_MODULE.TOKEN.TOKEN_NOT_FOUND');
    // await refreshTokenDoc.remove();
    const accessToken = await tokenService.generateAuthForRefresh(user);
    accessToken["refresh"] = { token: refreshToken, expires: token.expires };
    return { ...accessToken, user };
  } catch (error) {

    throw new ApiError(status.UNAUTHORIZED, error.message ? error.message : 'AUTHENTICATION');
  }
}

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
    await userService.updateUserById(user.id, { password: newPassword });
  } catch (error) {
    throw new ApiError(status.UNAUTHORIZED, `${responseMessages.AUTH_MODULE.LOGIN.PASSWORD_FAILD}`);
  }
};
/**
 * Reset password
 * @param {string} verifyEmailToken
 * @returns {Promise<User>}
 */
const emailLogin = async (emailLoginToken) => {
  try {
    const emailLoginTokenDoc = await tokenService.verifyToken(emailLoginToken, tokenTypes.Register_Or_Login);
    const user = await userService.getUserById(emailLoginTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.Register_Or_Login });
    return user;
  } catch (error) {
    throw new ApiError(status.UNAUTHORIZED, `${responseMessages.AUTH_MODULE.LOGIN.EMAIL_LOGIN_FAILED}`);
  }
};

/**
 * Reset password
 * @param {string} EmailVerificationToken
 * @returns {Promise}
 */
const emailVarification = async (emailVarificationToken) => {
  try {
    const emailVarificationTokenDoc = await tokenService.verifyToken(emailVarificationToken, tokenTypes.Verification_Email);
    const user = await userService.getUserById(emailVarificationTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.Verification_Email });
    await userService.updateUserById(user.id, { isEmailVarified: true });
  } catch (error) {
    throw new ApiError(status.UNAUTHORIZED, `${responseMessages.AUTH_MODULE.VERIFICATION.EMAIL_VERIFICATION_FAILED}`);
  }
};


const userAuthentication = async (token, userId) => {
  if (!token)
    throw new ApiError(status.UNAUTHORIZED, `${responseMessages.AUTH_MODULE.USER_AUTHENTICATION.TOKEN_NOT_FOUND}`);
  if (!userId)
    throw new ApiError(status.NOT_ACCEPTABLE, `${responseMessages.AUTH_MODULE.USER_AUTHENTICATION.USER_ID_MISSING}`);
  try {
    const verify = await tokenService.verifyToken(token, tokenTypes.ACCESS);
    if (verify && verify.sub == userId) {

      return await userService.getUserById(userId);
    }

  } catch {
    throw new ApiError(status.UNAUTHORIZED, `${responseMessages.AUTH_MODULE.USER_AUTHENTICATION.VERIFICATION_FAILED}`);
  }

}

// /**
//  * email code verification
//  * @param {number} 6 digit code
//  * @returns {object}
//  */
// let verirfyEmail = async (emailCode) => {
//   let emailVerifCode = await getCache(`${redisEnums.KEYS.EMAIL_CODE}-${emailCode}`)

//   if (!emailVerifCode || !emailVerifCode.email) {
//     throw new ApiError(status.BAD_REQUEST, 'AUTH_MODULE.VERIFY_EMAIL.GIVE_CORRECT_EMAIL_CODE');
//   }
//   return emailVerifCode;

// }

/**
 * email  verification
 * @param {number} 6 digit code
 * @returns {object}
 */
const verifyEmail = async (body, user) => {
  try {
    let emailVerifcod = "";
    if (!body || !body.emailCode)
      throw new ApiError(status.BAD_REQUEST, 'AUTH_MODULE.VERIFY_EMAIL.EMAIL_VERIF_CODE_MISSING');
    if (body.emailCode) {
      emailVerifcod = await verirfyEmail(body.emailCode);
    }
    if (user.email != emailVerifcod.email)
      throw new ApiError(status.BAD_REQUEST, 'UNAUTHORIZED');
    if (!emailVerifcod || !emailVerifcod.email)
      throw new ApiError(status.BAD_REQUEST, 'AUTH_MODULE.VERIFY_EMAIL.EMAIL_CODE_NOT_FOUND')

    if (emailVerifcod) {
      let user = await userService.updateOneUser({ email: emailVerifcod.email, $or: [{ role: "admin" }, { role: "user" }, { role: "agent" }] }, { isEmailVarified: true })

      if (!user)
        throw new ApiError(status.NOT_FOUND, "USER_NOT_FOUND")
      const tokens = await tokenService.generateAuthTokens(user);
      return ({ user: user, tokens });
    }
  } catch (error) {
    throw new ApiError(status.BAD_REQUEST, error.message);
  }
}

/**
 * resend email verification code
 * @param {string} email
 * @returns {object}
 */
const resendEmailCode = async (body, user) => {
  try {
    if (!body || !body.email)
      throw new ApiError(status.BAD_REQUEST, 'AUTH_MODULE.LOGIN.EMAIL_MISSING');
    let sixDigitCode = slugGenerator(undefined, 6, 'numeric', false, false, false);
    if (!sixDigitCode || !sixDigitCode.length)
      throw new ApiError(400, 'AUTH_MODULE.CREATE_USER.UNABLE_TO_CREATE_OTP')
    setCache(`${redisEnums.KEYS.EMAIL_CODE}-${sixDigitCode}`, undefined, { email: body.email }, redisEnums.TTL.EMAIL_CODE)
    if (body.email) {
      let user = await userService.findOneUser({ email: body.email })
      if (user && user.fullname) {
        sendEmailVerifemail(body.email, sixDigitCode, user.fullname)
      }
      if (!user)
        throw new ApiError(status.NOT_FOUND, 'USER_NOT_FOUND')
      return user;

    }
  }
  catch (error) {
    throw new ApiError(status.BAD_REQUEST, error.message);
  }
}
module.exports = {

  loginUserWithEmailAndPassword,
  refreshAuth,
  resetPassword,
  emailLogin,
  logout,
  emailVarification,

  userAuthentication,

  loginWithEmailAndPassword,

  verifyEmail,

  resendEmailCode


};