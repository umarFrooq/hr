const mongoose = require('mongoose');
const config = require('../../config/config');

const mongoUri = config.mongo.url;
const mongoOptions = config.mongo.options;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri, mongoOptions)

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}


module.exports = {
  connectDB,
  Test: require("../../app/test.module/test.module.model"),
  User: require('../../app/user/user.model').User,
  Token: require('../../app/auth/token.model'),
  Orginization: require('../../app/organization/organization.model').Orginazation,
  Checkin: require('../../app/checkin/checkin.model'),
  Permission:require('../../app/permission/permission.model'),
  Role: require('../../app/roles/role.model'),
  Leave: require('../../app/leaves/leaves.model')
}