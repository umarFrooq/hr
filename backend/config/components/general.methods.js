const slugify = require("slugify");
const { bidMultiplier, bidAmountCap, amountTypes } = require("../enums");
const cryptoRandomString = require("crypto-random-string");
let xml2js = require('xml2js');
const { status } = require("http-status")
const ApiError = require("../../utils/ApiError")
const { responseMessages } = require("../../utils/response.message")
const mongoose = require("mongoose");
const slugGenerator = (
  name,
  length = 8,
  type = "alphanumeric",
  lower = true,
  isSlug = true,
  includeCrypto = true,
) => {
  let randomString = cryptoRandomString({ length: length, type: type });
  if (name && name.length) {
    //let randomString = cryptoRandomString(8);
    // let _title = title&& title.length? title.replace(" ","-")+"-"+randomString:randomString;
    const slug = slugify(name, {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      remove: /[`~!@#$%^&*()_|+\-=?;:'",.<>{}\[\]\\\/]/gi, // remove characters that match regex, defaults to `undefined`
      lower: lower, // convert to lower case, defaults to `false`
      strict: true, // strip special characters except replacement, defaults to `false`
      locale: "vi", // language code of the locale to use
    });
    if (isSlug) return slug + "-" + randomString;
    else if (!includeCrypto) return slug;
    else return slug + randomString;
  } else return randomString;
};
/**

Calculates the minimum bid that should be placed for a given reserve price,
taking into account a bid cap and a bid multiplier. *
@param {number} reservePrice - The reserve price for the item being bid on.
@returns {number} - The minimum bid amount that should be placed. */
const minBidCapCalulator = (reservePrice) => {
  if (reservePrice < 100000)
    return 100;
  else if (reservePrice > 100000 && reservePrice < 500000)
    return 200;
  else return 500;
  // let result = Math.round(reservePrice * bidMultiplier);
  // let rem = 0;
  // rem = result % bidAmountCap;
  // result = (bidAmountCap - rem) + result;
  // return result;
}

/**

Returns a filtered object based on the provided date range.
@param {Object} filter - The filter object to apply the date range to.
@param {string} filter.to - The upper bound date for the range.
@param {string} filter.from - The lower bound date for the range.
@throws {ApiError} - Throws a 400 error if the to date is greater than today, the from date is greater than today, or the from date is greater than the to date.
@returns {Object} - The filtered object with the createdAt property set based on the date range. */

const dateFilter = (filter) => {
  if (filter && (filter.to || filter.from)) {
    let { to, from } = filter;
    if (to) {
      let toDate = new Date(to)
      to = toDate.setHours(23, 59, 59, 999);
    }
    if (to && from) {

      Object.assign(filter, { createdAt: { $gte: new Date(from), $lte: new Date(to) } });
    } else if (to && !from) {
      Object.assign(filter, { createdAt: { $lte: new Date(to) } });
    } else if (!to && from) {

      Object.assign(filter, { createdAt: { $gte: new Date(from) } });
    } else if (!to && !from) {
      Object.assign(filter, { createdAt: { $lte: new Date() } });
    }
    delete filter.from;
    delete filter.to;
    return filter;
  }
  else return filter;
}
const bidDateFilter = (start, end) => {

  if (start && end) {
    return { end: { $lte: new Date(end) }, start: { $gte: new Date(start) } }
  }
  if (end && !start) {
    return { end: { $lte: new Date(end) } };
  }
  if (!end && start) {
    return { start: { $gte: new Date(start) } };
  }
}
const jsonParser = (data) => {
  try {
    JSON.parse(data);
  } catch (err) {
    return false;
  }
  return true;
}

const sortingParserAggregation = (options) => {
  if (options && Object.values(options).length && options.sortBy) {
    if (jsonParser(options.sortBy))
      options.sortBy = JSON.parse(options.sortBy);
    else if (typeof options.sortBy == "string") {
      const sort = options.sortBy.split(",");
      if (sort.length) {
        const sortby = {}
        sort.forEach(it => {
          if (it.includes("-")) {
            sortby[it.replace("-", "")] = -1;
          }
          else sortby[it] = 1;
        })
        if (sortby && Object.keys(sortby).length) {
          options.sortBy = sortby;
        }
      }

    }

  }
  console.log(options);
  return options;

}

const addDate = (type = 'days', add = 1, date = new Date()) => {
  if (type == 'days')
    date = date.setDate(date.getDate() + add);
  if (type == 'monthly')
    date = date.setMonth(date.getMonth() + add);
  if (type == 'yearly')
    date = date.setFullYear(date.getFullYear() + add);
  return new Date(date);
}

const percentageToAmount = (type = amountTypes.amount, percentage, amount) => {
  if (type == amountTypes.percentage && percentage)
    return amount * percentage / 100;
  return percentage;

}

function xmlToJson(xml) {
  // xml = `<?xml version="1.0" encoding="utf-8"?>
  // <Vehicle xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  // xmlns="http://regcheck.org.uk">
  //   <vehicleJson>{
  //   "Cnit": null,
  //   "Make": "Land Rover",
  //   "Model": "",
  //   "Year": "1993",
  //   "Engine": "",
  //   "Transmission": "",
  //   "BodyStyle": "",
  //   "Country": "United Kingdom",
  //   "VechileIdentificationNumber": "SALKA9B79PA042653",
  //   "ImageUrl": "http://vehicleregistrationapi.com/image.aspx/@TGFuZCBSb3ZlciA="
  // }</vehicleJson>
  //   <vehicleData>
  //     <Description>Land Rover </Description>
  //     <RegistrationYear>1993</RegistrationYear>
  //     <CarMake>
  //       <CurrentTextValue>Land Rover</CurrentTextValue>
  //     </CarMake>
  //     <CarModel />
  //     <BodyStyle>
  //       <CurrentTextValue />
  //     </BodyStyle>
  //     <EngineSize>
  //       <CurrentTextValue />
  //     </EngineSize>
  //     <Transmission>
  //       <CurrentTextValue />
  //     </Transmission>
  //   </vehicleData>
  // </Vehicle>`;
  var parser = new xml2js.Parser({ trim: true });
  return parser.parseStringPromise(xml).then(function (result) {
    console.log(result.Vehicle.vehicleJson[0]);
    if (!result || !result.Vehicle || !result.Vehicle.vehicleJson || !result.Vehicle.vehicleJson.length)
      return null;
    return JSON.parse(result.Vehicle.vehicleJson[0]);

  })
    .catch(function (err) {
      console.log(err)
      return null;
    });
}
const dateValidation = (to, from) => {
  if (to && new Date(to).getTime() > new Date().getTime())
    throw new ApiError(400, `${responseMessages.TO_DATE_CANNOT_BE_GREATER_THAN_TODAY}`);
  if (from && new Date(from).getTime() > new Date().getTime())
    throw new ApiError(400, `${responseMessages.FROM_DATE_CANNOT_BE_GREATER_THAN_TODAY}`);
  if (to && from && new Date(to).getTime() < new Date(from).getTime())
    throw new ApiError(400, `${responseMessages.FROM_DATE_CANNOT_BE_GREATER_THAN_TO_DATE}`);
};

const objectIdParsing = (filter, objectIdKeys) => {
  objectIdKeys.forEach((key) => {
    if (filter[key])
      filter[key] = new mongoose.Types.ObjectId(filter[key])
  });
}

function getDateDifferenceInDays(startDate, endDate) {
  // Get time difference in milliseconds
  const diffInMs = endDate - startDate;

  // Convert milliseconds to days
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
}
module.exports = {
  slugGenerator,
  minBidCapCalulator,
  dateFilter,
  bidDateFilter,
  jsonParser,
  sortingParserAggregation,
  addDate,
  percentageToAmount,
  xmlToJson,
  dateValidation,
  objectIdParsing,
  getDateDifferenceInDays
}