const Joi = require('joi');
const { password } = require('./custom.validation');
const myCustomJoi = Joi.extend(require('joi-phone-number'));
const { countries } = require('../../config/enums')

const register = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().custom(password).required(),
    fullname: Joi.string(),
    phone: myCustomJoi.string().phoneNumber(),
    address: Joi.object().keys({
      address: Joi.string().min(5).max(100),
      city: Joi.string().min(3).max(50),
      state: Joi.string().min(2).max(50),
      country: Joi.string().valid(...Object.values(countries)),
      zipCode: Joi.string().min(4).max(10),
     coordinates: Joi.array().items(
        Joi.number().min(-180).max(180), // longitude
        Joi.number().min(-90).max(90)    // latitude
      ).length(2)
    }),
    brandName: Joi.string().min(3).max(50),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};
const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const facebookLogin = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    origin: Joi.object().keys({
      source: Joi.string(),
      version: Joi.string().allow(null)
    })
  })
};
const googleLogin = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    origin: Joi.object().keys({
      source: Joi.string(),
      version: Joi.string().allow(null)
    })
  })
};
const sendVerificationEmail = {
  body: Joi.object().keys({
    email: Joi.string().required(),
  })
};
const createFacebookUser = {
  body: Joi.object().keys({
    facebookId: Joi.string().required(),
  }),
};
const createGoogleUser = {
  body: Joi.object().keys({
    googleId: Joi.string().required(),
  }),
}
const userAuthentication = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    // userId: Joi.string().required(),
  }),
}

const verifyPhoneNumber = {
  body: Joi.object().keys({
    // hash: Joi.string().required(),
    phoneToken: Joi.string().required(),
    origin: Joi.object().keys({
      source: Joi.string(),
      version: Joi.string().allow(null)
    })
  }),
}


const verifyPhoneEmail = {
  body: Joi.object().keys({
    emailCode: Joi.number().required(),
    phoneToken: Joi.string().required()
  }),
}

const appleLogin = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    origin: Joi.object().keys({
      source: Joi.string(),
      version: Joi.string().allow(null)
    })
  })
};
const verifyEmail = {
  body: Joi.object().keys({
    emailCode: Joi.string().required()
  }),
}

const resendEmailCode = {
  body: Joi.object().keys({
    email: Joi.string().required().email()
  }),
}

const verificationOfPhone = {
  body: Joi.object().keys({
    phoneToken: Joi.string().required()
  }),
}
module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  createFacebookUser,
  createGoogleUser,
  userAuthentication,
  facebookLogin,
  googleLogin,
  verifyPhoneNumber,
  appleLogin,
  verifyPhoneEmail,
  verifyEmail,
  resendEmailCode,
  verificationOfPhone

};
