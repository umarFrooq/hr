const authService = require("./auth.services");
const userService = require("../user/user.service");
const tokenService = require("./token.service");
const emailService = require("./email.service");
const {status} = require('http-status');
const catchAsync = require("../../utils/catchAsync");



const login = catchAsync(async (req, res) => {

  const { email, password, role } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password, role);
  const tokens = await tokenService.generateAuthTokens(user);

  res.sendStatus({ user, tokens });
});



const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.sendStatus(null, status.NO_CONTENT);
})
const registerUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.sendStatus({ user, tokens }, status.CREATED);
});


const refreshTokens = catchAsync(async (req, res) => {

  const refreshtokens = await authService.refreshAuth(req.body.refreshToken);
  const tokens = refreshtokens.tokens;
  const user = refreshtokens.user;
  res.sendStatus(refreshtokens);
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );

  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.sendStatus(null, status.NO_CONTENT);
});
const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.sendStatus(null, status.NO_CONTENT);
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerificationEmailToken(
    req.body.email
  );
  await emailService.sendVerificationEmail(req.body.email, verifyEmailToken);
  res.sendStatus(null, status.NO_CONTENT);
});

const sendVerificationSmsCode = catchAsync(async (req, res) => {
  const verificationCode = await smsService.sendVerficationCode("", req.body.phoneNumber);
  res.status(status.OK).send(verificationCode);
});



const current = catchAsync(async (req, res) => {
  const _user = req.user;
  res.status(status.OK).send({ _user });
})


const userLogin = catchAsync(async (req, res) => {

  const { email, password, role } = req.body;
  const user = await authService.loginWithEmailAndPassword(email, password, role);
  const tokens = await tokenService.generateAuthTokens(user);

  res.sendStatus({ user, tokens });
});


const verifyEmail = catchAsync(async (req, res) => {
  const verify = await authService.verifyEmail(req.body,req.user);
  res.sendStatus( verify )
})


const resendEmailCode = catchAsync(async (req, res) => {
  const user = await authService.resendEmailCode(req.body,req.user);
  const tokens = await tokenService.generateEmailPhonVerifAuthTokens(user);
  res.sendStatus({ user, tokens });
})



module.exports = {
  registerUser,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,

  sendVerificationSmsCode,

  current,

  userLogin,
 
  verifyEmail,

  resendEmailCode

};