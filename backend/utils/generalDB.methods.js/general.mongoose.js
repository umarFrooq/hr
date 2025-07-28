/**
 * mongoose schema level phone number validation validation
 * @param {String} value --phonenumber
 * @returns {String}
 */
const phoneNumberValidation = (value) => {
  let reg = /^\+(?:[0-9] ?){6,14}[0-9]$/;
  const valid = reg.test(value)
  return valid;
}
module.exports = {  phoneNumberValidation }