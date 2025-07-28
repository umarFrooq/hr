const express = require("express");
const authController = require("./auth.controller");
const validate = require("../../middlewares/validate");
const authValidation = require("./auth.validations");
const auth = require('../../middlewares/auth');
const router = express.Router();

router.get("/health-check", (req, res) => res.send("OK"));
router.post(
    "/send-verification-email", auth("manageProfile"),
    validate(authValidation.sendVerificationEmail),
    authController.sendVerificationEmail
);
router.post(
    "/register",
    // auth('getUsers'),
    validate(authValidation.register),
    authController.registerUser
);
router.post("/login", validate(authValidation.login), authController.login);
router.post('/logout', validate(authValidation.logout), authController.logout);
router.post(
    "/refresh-tokens",
    validate(authValidation.refreshTokens),
    authController.refreshTokens
);
router.post(
    "/forgot-password",
    validate(authValidation.forgotPassword),
    authController.forgotPassword
);

router.post(
    "/reset-password",
    validate(authValidation.resetPassword),
    authController.resetPassword
);
router.post("/current", auth('manageAuth'), authController.current);

router.route("/verify-email").post(auth('manageAuth'), validate(authValidation.verifyEmail), authController.verifyEmail)
router.route("/resend-code").post(validate(authValidation.resendEmailCode), authController.resendEmailCode)

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * path:
 *  /auth/register:
 *    post:
 *      summary: Register as user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - fullname
 *                - email
 *                - password
 *              properties:
 *                fullname:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *                password:
 *                  type: string
 *                  format: password
 *                  minLength: 8
 *                  description: At least one number and one letter
 *              example:
 *                fullname: fake name
 *                email: fake@example.com
 *                password: password1
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  user:
 *                    $ref: '#/components/schemas/User'
 *                  tokens:
 *                    $ref: '#/components/schemas/AuthTokens'
 *        "400":
 *          $ref: '#/components/responses/DuplicateEmail'
 */
/**
 * @swagger
 * path:
 *  /auth/registerSeller:
 *    post:
 *      summary: Register as RequestedSeller
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - fullname
 *                - email
 *                - password
 *                - phone
 *              properties:
 *                fullname:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *                phone:
 *                  type: string
 *                  format: phone
 *                  description: must be unique
 *                password:
 *                  type: string
 *                  format: password
 *                  minLength: 8
 *                  description: At least one number and one letter
 *              example:
 *                fullname: fake request seller name
 *                email: fakeRequestedSeller@example.com
 *                password: password1
 *                phone:  "+9230010044000"
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  user:
 *                    $ref: '#/components/schemas/User'
 *                  tokens:
 *                    $ref: '#/components/schemas/AuthTokens'
 *        "400":
 *          $ref: '#/components/responses/DuplicateEmail'
 *
 */

/**
 * @swagger
 * path:
 *  /auth/default-address:
 *    post:
 *      summary: selecting an address from user's addresses as a default address
 *      tags: [Auth]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - addressId
 *              properties:
 *                addressId:
 *                  type: string
 *                  description: Must be the among user's addresses
 *              example:
 *                addressId: 5fdb33a2b9e7743d34443e5f
*      responses:
 *        "200":
 *          description: No content
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 *        "403":
 *          $ref: '#/components/responses/Forbidden'
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */



/**
 * @swagger
 * path:
 *  /auth/login:
 *    post:
 *      summary: Login
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - password
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                password:
 *                  type: string
 *                  format: password
 *              example:
 *                email: fake@example.com
 *                password: password1
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  user:
 *                    $ref: '#/components/schemas/User'
 *                  tokens:
 *                    $ref: '#/components/schemas/AuthTokens'
 *        "401":
 *          description: Invalid email or password
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *              example:
 *                code: 401
 *                message: Invalid email or password
 */
/**
 * @swagger
 * path:
 *  /auth/logout:
 *    post:
 *      summary: Logout
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - refreshToken
 *              properties:
 *                refreshToken:
 *                  type: string
 *              example:
 *                refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *      responses:
 *        "204":
 *          description: No content
 *        "401":
 *          $ref: '#/components/responses/NotFound'
 */


/**
 * @swagger
 * path:
 *  /auth/refresh-tokens:
 *    post:
 *      summary: Refresh auth tokens
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - refreshToken
 *              properties:
 *                refreshToken:
 *                  type: string
 *              example:
 *                refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AuthTokens'
 *        "401":
 *          $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * path:
 *  /auth/forgot-password:
 *    post:
 *      summary: Forgot password
 *      description: An email will be sent to reset password.
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *              example:
 *                email: fake@example.com
 *      responses:
 *        "204":
 *          description: No content
 *        "404":
 *          $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * path:
 *  /auth/reset-password:
 *    post:
 *      summary: Reset password
 *      tags: [Auth]
 *      parameters:
 *        - in: query
 *          name: token
 *          required: true
 *          schema:
 *            type: string
 *          description: The reset password token
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - password
 *              properties:
 *                password:
 *                  type: string
 *                  format: password
 *                  minLength: 8
 *                  description: At least one number and one letter
 *              example:
 *                password: password1
 *      responses:
 *        "204":
 *          description: No content
 *        "401":
 *          description: Password reset failed
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *              example:
 *                code: 401
 *                message: Password reset failed
 */

/**
 * @swagger
 * path:
 *  /auth/registerOrLoginFromEmail:
 *    post:
 *      summary: login or register with email
 *      description: An email will be sent to login.
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *              example:
 *                email: fake@example.com
 *      responses:
 *        "204":
 *          description: No content
 */

/**
 * @swagger
 * path:
 *  /auth/login-email:
 *    post:
 *      summary: login via Email
 *      tags: [Auth]
 *      parameters:
 *        - in: query
 *          name: token
 *          required: true
 *          schema:
 *            type: string
 *          description: The email login token
 *
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  user:
 *                    $ref: '#/components/schemas/User'
 *                  tokens:
 *                    $ref: '#/components/schemas/AuthTokens'
 *        "401":
 *          description: Invalid email token
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *              example:
 *                code: 401
 *                message: Invalid email
 */

/**
* @swagger
* path:
*  /auth/send-verification:
*    post:
*      summary: verify Email
*      description: An email will be sent to verify email.
*      tags: [Auth]
*      security:
*        - bearerAuth: []
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              type: object
*              required:
*                - email
*              properties:
*                email:
*                  type: string
*                  format: email
*              example:
*                email: fake@example.com
*      responses:
*        "204":
*          description: No content
*        "404":
*          $ref: '#/components/responses/NotFound'
*/

/**
* @swagger
* path:
*  /auth/email-verification:
*    post:
*      summary: verify email
*      tags: [Auth]
*      parameters:
*        - in: query
*          name: token
*          required: true
*          schema:
*            type: string
*          description: The verify email token
*      responses:
*        "204":
*          description: No content
*        "401":
*          description: verify email failed
*          content:
*            application/json:
*              schema:
*                $ref: '#/components/schemas/Error'
*              example:
*                code: 401
*                message: verify email failed
*/
