const responseMessages = {
  TEST_MODULE: {
    CREATE: {
    }
  },
  AUTH_MODULE: {
    LOGIN: {
      INVALID_EMAIL_PASSWORD: "Incorrect email or password",
      PASSWORD_FAILD: "Password reset failed",
      EMAIL_LOGIN_FAILED: 'Email login failed',
      MISSING_SECRET_OR_API_KEY: "missing api key or secret key from headers",
      USER_FOUND: "user found",
      INVALID_CREDENTAILS: "invalid credentials",
      AUTHENTICATION_FAILED: "authentication failed",
      SOME_THING_WENT_WRONG: "Something went wrong please try later.",
      EMAIL_MISSING: "Email is missing",
    },
    VERIFICATION: {
      EMAIL_VERIFICATION_FAILED: 'email verification failed',
      SMS_VERIFICATION_FAILED: "phone verification failed"
    },
    LOGOUT: {
      REFRESH_TOKEN_NOT_EXIST: "refresh token doesnt exist"
    },
    TOKEN: {
      TOKEN_VERIFICATION_FAILED: "Token verification failed",
      USER_NOT_FOUND: "User not found for this token.",
      TOKEN_NOT_FOUND: "Token not found. Please try to login again.",
      NO_USERS_FOUND: 'No users found with this email'
    },
    GOOGLE_AUTH: {
      NOT_AUTHENTICATED: "Not authenticated"
    },
    USER_AUTHENTICATION: {
      TOKEN_NOT_FOUND: "token not found",
      USER_ID_MISSING: "user id missing",
      VERIFICATION_FAILED: 'User verification failed'
    },
    PHONE_EMAIL_VERIFICATION: {
      PHONE_TOKEN_MISSING: "Phone token is missing",
      EMAIL_VERIF_CODE_MISSING: "email verification code is missing",
      EMAIL_PHONE_VERIFICATION_FAILED: "email or phone verification failed try again",
      INVALID_PHONE_TOKEN: "Invalid phone token."
    },
    CREATE_USER: {
      UNABLE_TO_CREATE_USER: "Unable to create new user.",
      UNABLE_TO_CREATE_OTP: "Unable to create otp for email. Please try later.",
      PHONE_NUMBER_NOT_FOUND: "phone number not found",
      EMAIL_VARIF_CODE_NOT_FOUND: "Email varification code not found",
      CANT_ADD_USER_ROLE: "This role is not allowed"

    },
    VERIFY_EMAIL: {
      GIVE_CORRECT_EMAIL_CODE: 'please give the correct code sent to the email',
      EMAIL_VERIF_CODE_MISSING: "email verification code is missing",
      EMAIL_CODE_NOT_FOUND: "Email verification code not found"
    },
    // FACEBOOK_AUTH:{
    //   INVALID_TOKEN:"Invalid Token"
    // }
  },
  USER_MODULE: {
    CREATE_USER: {
      EMAIL_ALREADY_TAKEN: "Email already taken",
      PHONE_NOT_FOUND: "phone not found",
      SELECT_ADMIN: "Please select admin for this user",
      INVALID_ADMIN: "Invalid admin",
      ORGANIZATION_ERROR: "Organization does not belong to selected admin",
      CANT_ADD_USER_ROLE: "You are not allowed to add this role",
      SELECT_ADMIN_ORGANIZATION: "Please select admin or organization for this user",
      ORGANIZATION_NOT_EXIST:"Please add a organization for this user"

      // EMAIL_ALREADY_TAKEN:"Email already taken"
    },
    UPLOAD_PROFILE: {
      PROFILE_IMAGE: "profile image is required.",
      UPDATE_OWN_IMAGE: "you can onlu update your profile image."

    },
    PHONE_ALREADY_TESTED: "Phone number already taken",
    INVALID_EMAIL: "Invalid email",
    INVALID_MOBILE_NO: "Invalid mobile no",
    PASSWORD_MUST_BE_ALPHANUMERIC: "Password must contain at least one letter and one number"

  },
  ORGANIZATION_MODULE: {
    CREATE_ORGANIZATION: {
      ALREADY_EXISTS: "Organization already exists for this user.",
      SELECT_CLIENT:"Please select client for this organization"
    }
  },
  CREATION_FAILED: "creation failed.",
  GET_ALL_FAILED: "Error while getting",
  NOT_FOUND: "not found",
  AUTHENTICATION: "Please authenticate",
  USER_NOT_FOUND: "User not found",
  TOKEN_NOT_FOUND: 'Token not found',
  INVALID_TOKEN: "Invalid  Token",
  FORBIDDEN: "FORBIDDEN",
  OK: "ok",
  UNAUTHORIZED: "you are unauthorized",
  USERID_REQUIRED: "Please select a user. User id is required.",
  CREATE_NEW: "Please create a new",
  USER_REQUIRED: "User is required",
}
const projectModules = {
  AUTH: "auth",
  USER: "user",
  ORGINIZATION: "Organization",
  
}
module.exports = {
  responseMessages,
  projectModules
}