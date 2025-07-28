const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../../config/config');
const userService = require('../user/user.service');
const db = require('../../utils/mongoose/mongoose');
const {status} = require('http-status');
const ApiError = require('../../utils/ApiError')
const crypto = require("crypto");
const { tokenTypes } = require("../../config/token");
const User = db.User;
const Token = db.Token;
// const { responseMessages, projectModules } = require("../../utils/response.message");

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, secret = config.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
    };
    return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
    const tokenDoc = new Token({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,

    });
    return await tokenDoc.save()

};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
    if (!tokenDoc) {
        throw new Error('TOKEN_NOT_FOUND');
    }
    return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {


    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpires);

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(user.id, refreshTokenExpires);
    await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */

const generateResetPasswordToken = async (email) => {
    const user = await userService.getUserByEmail(email);
    if (!user) {
        throw new ApiError(status.NOT_FOUND, 'AUTH_MODULE.TOKEN.NO_USERS_FOUND');
    }
    const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = generateToken(user.id, expires);
    await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
};

const generateRegisterOrLoginFromEmailToken = async (email) => {    // once 
    const user = await userService.getUserByEmail(email);
    if (!user) {
        var fullname = "user_" + crypto.randomBytes(5).toString('hex');
        var tempUser = new User({ email, fullname, isEmailVarified: true, verificationMethod: 'email' })
        const newUser = await userService.createUser(tempUser);

        const expires = moment().add(config.jwt.registerOrLoginFromEmailTokenExpirationMinutes, 'minutes');
        const registerOrLoginToken = generateToken(newUser._id, expires);
        await saveToken(registerOrLoginToken, newUser._id, expires, tokenTypes.Register_Or_Login);
        return registerOrLoginToken;
    }
    const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
    const registerOrLoginToken = generateToken(user.id, expires);
    await saveToken(registerOrLoginToken, user.id, expires, tokenTypes.Register_Or_Login);
    return registerOrLoginToken;
};
const generateVerificationEmailToken = async (email) => {
    const user = await userService.getUserByEmail(email);
    if (!user) {
        throw new ApiError(status.NOT_FOUND, 'No users found with this email');
    }
    const expires = moment().add(config.jwt.verificationEmailExpirationMinutes, 'minutes');
    const verificationEmailToken = generateToken(user.id, expires);
    await saveToken(verificationEmailToken, user.id, expires, tokenTypes.Verification_Email);
    return verificationEmailToken;
};




/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthForRefresh = async (user) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpires);
    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
    };
}



const getOneToken = async (filter) => {
    return await Token.findOne(filter);
}



module.exports = {
    generateToken,
    saveToken,
    verifyToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateRegisterOrLoginFromEmailToken,
    generateVerificationEmailToken,
    getOneToken,
    generateAuthForRefresh,
};