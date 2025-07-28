// This file validates the environment variables that are required for the application to run

/**
 * @fileoverview Config file for the application
 * @requires NPM:dotenv
 * @requires NPM:path
 * @requires NPM:joi
 * @requires NPM:dotenv
 */

const dotenv = require('dotenv');
const path = require('path');
const Joi = require("joi");
dotenv.config({ path: path.join(__dirname, '../.env') });
const envVarsSchema = Joi.object().keys({
    //  Port
    PORT: Joi.number().default(3004),

    // Mongodb host url
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    // JWT
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(330).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which reset password tokens expire'),
    JWT_REGISTER_OR_LOGIN_FROM_EMAIL_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which registerOrLogin tokens expire'),
    JWT_VERIFICATION_EMAIL_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which verification email tokens expire'),
    JWT_VERIFICATION_PHONE_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which verification email tokens expire'),
    JWT_OTP_MIN: Joi.number().default(330).description('minutes after which phone and email verification access tokens expire'),
    // S3 credentials
    AWS_ACCESS_KEY_ID: Joi.string().description('the AWS access ID'),
    AWS_SECRET_ACCESS_KEY: Joi.string().description('the AWS access key'),
    AWS_REGION: Joi.string().description('the AWS access key'),
    AWS_BUCKET_NAME: Joi.string().description('the AWS bucket name'),
    SENDGRID_API_KEY: Joi.string().description('the sendgrid api key'),
    MAIL_FROM: Joi.string().description('the mail from'),
}).unknown();
const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,


    mongo: {
        url: envVars.MONGODB_URL,
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        },
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
        resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
        registerOrLoginFromEmailTokenExpirationMinutes: envVars.JWT_REGISTER_OR_LOGIN_FROM_EMAIL_EXPIRATION_MINUTES,
        verificationEmailExpirationMinutes: envVars.JWT_VERIFICATION_EMAIL_EXPIRATION_MINUTES,
        verificationPhoneExpirationMinutes: envVars.JWT_VERIFICATION_PHONE_EXPIRATION_MINUTES,
        EmailPhoneVerifExpireationMinutes: envVars.JWT_OTP_MIN,
    },
    aws: {
        awsAccessKeyId: envVars.AWS_ACCESS_KEY_ID,
        awsSecretAccesskey: envVars.AWS_SECRET_ACCESS_KEY,
        awsRegion: envVars.AWS_REGION,
        awsBucketName: envVars.AWS_BUCKET_NAME,
    },
    sendgrid: {
        sendgridApiKey: envVars.SENDGRID_API_KEY,
        mailFrom: envVars.MAIL_FROM,
    }
};