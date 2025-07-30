
const db = require("../../utils/mongoose/mongoose");
const { status } = require("http-status");
const ApiError = require("../../utils/ApiError");
const User = db.User;
const { roleTypes, organizationRoles, nonOrganizationRoles, scope } = require("../../config/enums");
const { atlasSearchQueryParser, aggregationPagination, searchQuery, updateById } = require("../../utils/generalDB.methods.js/DB.methods");
const sortByParser = require("../../config/sortby.parse");
const { responseMessages, projectModules } = require("../../utils/response.message");
const S3Util = require("../../config/s3.file.system");
const { findOneRole } = require("../roles/role.service");
const { dateFilter, objectIdParsing } = require("../../config/components/general.methods");


const organizationRolesArray = Object.values(organizationRoles);
const nonOrganizationRolesArray = Object.values(nonOrganizationRoles)

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody, user, permission) => {
  await userGenericValidations(user, userBody, permission);
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(status.BAD_REQUEST, `${responseMessages.USER_MODULE.CREATE_USER.EMAIL_ALREADY_TAKEN}`);
  }
  if (userBody.mobile)
    if (await User.isMobileTaken(userBody.mobile)) {
      throw new ApiError(status.BAD_REQUEST, `${responseMessages.USER_MODULE.PHONE_ALREADY_TESTED}`);
    }

  const result = await User.create(userBody);
  // if (!userBody.role == roles.ADMIN) {
  //   User.findByIdAndUpdate(user.id, { admin: user.id })
  // }
  return result;
};



/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return await User.findById(id);
};


/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });

}

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody, updatedBy, permission) => {
  const { findOrganizationById } = require("../organization/organization.service");
  await userGenericValidations(updatedBy, updateBody, permission, false);
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'USER_NOT_FOUND');
  }

  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {

    throw new ApiError(status.BAD_REQUEST, responseMessages.USER_MODULE.CREATE_USER.EMAIL_ALREADY_TAKEN);
  }
  if (updateBody.phone && (await User.isPhoneTaken(updateBody.phone, userId))) {

    throw new ApiError(status.BAD_REQUEST, responseMessages.USER_MODULE.PHONE_ALREADY_TESTED);
  }


if (updateBody.advanceSalary) {
    user.advanceSalaries.push(updateBody.advanceSalary[0]);
    delete updateBody.advanceSalary;
  }
  if (updateBody.deduction) {
    user.deductions.push(updateBody.deduction[0]);
    delete updateBody.deduction;
  }

  const totalDeductions = user.deductions.reduce((acc, curr) => acc + curr, 0);
  const totalAdvanceSalaries = user.advanceSalaries.reduce((acc, curr) => acc + curr, 0);
  user.totalSalary = user.salary - totalDeductions - totalAdvanceSalaries;

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(status.NOT_FOUND, 'USER_NOT_FOUND');
  }
  await User.findByIdAndDelete(userId);
  return user;
};





const changePassword = async (user, body) => {
  const { oldPassword, newPassword } = body;
  const bool = await user.isPasswordMatch(oldPassword);
  if (bool) {
    Object.assign(user, { password: newPassword });
    console.log(user);
    return await user.save();
  }
  else throw new ApiError(status.FORBIDDEN, "Wrong Password");
}



/**
 * Get users by email and role
 * @param {string} email
 * @param {string} role
 * @returns {Promise<User>}
 */
async function getUserByEmailAndRole(email, role) {
  return User.findOne({ email, $or: role });
    // return User.find({});


}

const findOneUser = async (query) => {
  return await User.findOne(query);
}

/**
 * Query for Users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {Object} search - search params like {name:"", value:""}
 * @param {Query} project - mongo projection query
 * @param {Query} lookUp - mongo lookup query
 * @returns {Promise<QueryResult>}
 **/

const userSearch = (filter, options, search, project, lookUp, additionalquery) => {
  let filterSearch;
  // search parsing for search
  if (search && search.name && search.value) {

    filterSearch = searchQuery({ indexName: indexes.users.search.indexName, propertyName: indexes.users.search.propertyName }, search.value);
  }
  // Query parsing for search
  return atlasSearchQueryParser(filter, options, filterSearch, project, lookUp, additionalquery);
}

/**
 * Query for Users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getAllUsers = async (filter, options, search) => {
  // Sorting 
  let userLookup = {};
  let userUnwind = {};
  let additionalquery = []
  options = sortByParser(options, { 'createdAt': -1 });
  if (filter && Object.keys(filter).length <= 0 || filter.role == roles.user || filter.role == undefined) {
    filter["role"] = roles.user;
    userLookup = {
      '$lookup': {
        'from': 'addresses',
        'localField': 'defaultAddress',
        'foreignField': '_id',
        'as': 'address'
      }
    }

    userUnwind = {
      '$unwind': {
        'path': '$address',
        'preserveNullAndEmptyArrays': true
      }
    }
    additionalquery = [userLookup, userUnwind]
  } else {
    userLookup = {
      '$lookup': {
        'from': 'sellerdetails',
        'localField': '_id',
        'foreignField': 'seller',
        'as': 'address'
      }
    }

    userUnwind = {
      '$unwind': {
        'path': '$address',
        'preserveNullAndEmptyArrays': true
      }
    }
    additionalquery = [userLookup, userUnwind]
  }

  if (filter.city) {
    additionalquery.push({
      '$match': { 'address.city': filter.city }
    })
    delete filter.city;
  }



  // Date filters and validations
  const { to, from } = filter;
  if (to && to.getTime() > new Date().getTime())
    throw new ApiError(400, "to date cannot be greater than today");
  if (from && from.getTime() > new Date().getTime())
    throw new ApiError(400, "to date cannot be greater than today");
  if (to && from && to.getTime() < from.getTime())
    throw new ApiError(400, "from date cannot be greater than to date");
  if (to && from) {
    Object.assign(filter, { createdAt: { $gte: from, $lte: to } });
  } else if (to && !from) {
    Object.assign(filter, { createdAt: { $lte: to } });
  } else if (!to && from) {
    Object.assign(filter, { createdAt: { $gte: from } });
  }
  delete filter.to;
  delete filter.from;
  // End Date filters and validations

  // Projection of required fields
  const project = {
    id: "$_id",
    _id: 0,
    fullname: 1,
    email: 1,
    role: 1,
    phone: 1,
    verificationMethod: 1,
    origin: 1,
    address: {
      address: 1,
      city: 1
    }
  };
  // Get final agregation pipeline
  const query = userSearch(filter, options, search, project, undefined, additionalquery);
  // Execution of query
  if (query) {
    const result = await aggregationPagination(User, query.query, query.options, query.facetFilter);
    if (result && result.isSuccess)
      return result.data
    else throw new ApiError(result.status, result.message);
  } else throw new ApiError(500, "Something went wrong please try again.");
}

const changePasswordAdmin = async (user, body) => {
  const { newPassword, userId } = body;
  if (!newPassword) return { status: 400, success: false, data: null, message: "please provide new password" };
  if (!userId) return { status: 400, success: false, data: null, message: "please provide userId" };
  let _user = await User.findById(userId)
  if (_user) {
    Object.assign(_user, { password: newPassword })
    await _user.save();
    return { status: 200, success: true, data: _user, message: "password updated successfully" };
  }
  else
    return { status: 400, success: false, data: null, message: "no user found aginst provided user id" };

}




const updateOneUser = async (filter, data) => {
  return await User.findOneAndUpdate(filter, data, { new: true })
}







/**
 * Uploads a profile image for a user.
 *
 * @param {Array} files - An array of files to be uploaded.
 * @param {Object} user - The user object.
 * @param {Object} body - The request body object.
 * @throws {ApiError} Throws a 400 error if no files are provided.
 * @throws {ApiError} Throws a 400 error if the userId is missing and the user's role is allowed.
 * @throws {ApiError} Throws a 404 error if the user is not found.
 * @return {Promise} Returns a promise that resolves to the updated user object.
 */

const uploadLogo = async (files, user, body) => {
  let userId = user.id;
  let removeImage = body.removeImage;
  if (!files || !files.logo || !files.logo.length)
    if (!body.removeImage)
      throw new ApiError(400, responseMessages.USER_MODULE.UPLOAD_PROFILE.PROFILE_IMAGE);
  const allowedRoles = [roles.ADMIN]
  if (allowedRoles.includes(user.role)) {
    if (!body.userId)
      throw new ApiError(status.BAD_REQUEST, responseMessages.USERID_REQUIRED);
    userId = body.userId
  }
  const getUser = await getUserById(userId);
  if (!getUser)
    throw new ApiError(status.NOT_FOUND, responseMessages.USER_NOT_FOUND);
  if (body.removeImage)
    getUser.logo = null;
  if (body?.removeImage && body?.removeImage != getUser.logo)
    throw new ApiError(status.BAD_REQUEST, responseMessages.USER_MODULE.UPLOAD_PROFILE.UPDATE_OWN_IMAGE);
  if (getUser.logo)
    removeImage = getUser.logo;

  if (files?.logo?.length)
    getUser.logo = files.logo[0].location;

  if (removeImage) {
    let s3 = new S3Util([removeImage], null);
    s3.deleteManyFromS3();
  }

  return await userUpdateById(userId, { logo: getUser.logo });


}

/**
 * Updates a user with the given ID.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {object} payload - The data to update the user with.
 * @return {Promise<object>} The updated user.
 */

const userUpdateById = async (userId, payload) => {
  return await User.findByIdAndUpdate(userId, payload, { new: true });
}

/**
 * Asynchronously updates users based on the provided filter and body.
 *
 * @param {Object} filter - The filter used to select which users to update.
 * @param {Object} body - The data to update the selected users with.
 * @return {Promise} A promise that resolves with the result of the update operation.
 */

const updateUsers = async (filter, body) => {
  // console.log(filter)
  return await User.updateMany(filter, { $set: body });
}

const profile = async (user, id) => {
  if (user.role !== roles.ADMIN) {
    id = user.id;
  }
  return await getUserById(id)
}

const updateUser = (userId, updateBody) => {
  return User.findByIdAndUpdate(userId, updateBody, { new: true });
}

const findAllUsers = async (filter, options, user, permission) => {
  const { addFilter, valid } = permissionHandler(user, permission);
  if (!valid)
    throw new ApiError(status.BAD_REQUEST, `${responseMessages.FORBIDDEN}`);
  if (addFilter)
    Object.assign(filter, addFilter);
  if (filter.reportsTo) {
    const reportsTo = filter.reportsTo
    delete reportsTo;
    filter["reportsTo.id"] = filter.reportsTo;
  }
  if (filter.organization) {
    const organization = filter.organization
    delete organization;
    filter["organization.id"] = filter.organization;
  }
  if (search && (search.value || search.name)) {
    const searchValue = search.value || search.name;
    return await User.paginateWithSearch(filter, options, searchValue);
  }
  return await User.paginate(filter, options)
}

const findUserById = async (id, user) => {

  if (!organizationRolesArray.includes(user.role) && user.id.toString() !== id.toString()) {
    throw new ApiError(status.FORBIDDEN, `${responseMessages.FORBIDDEN}`);
  }
  const getUser = await getUserById(id);
  if (user.role != roleTypes.SUPER_ADMIN && user.organization.id.toString() !== getUser.organization.id.toString()) {
    throw new ApiError(status.FORBIDDEN, `${responseMessages.FORBIDDEN}`);
  }
  return getUser;
}

const roleChecker = async (user, orgValid = true, data) => {
  if (!organizationRolesArray.includes(user.role)) {
    return false
  }
  let organization = null;
  if (orgValid && data) {
    switch (user.role) {
      case roleTypes.SUPER_ADMIN:
        organization = await findOrganizationById(data.organization);
        if (!organization)
          return { isSuccess: false, message: `${projectModules.ORGANIZATION} ${responseMessages.NOT_FOUND}` };
        break;
      case (roleTypes.ADMIN || roleTypes.HR || roleTypes.MANAGER):
        if (user.organization.id.toString() !== data.organization)
          return { isSuccess: false, message: `${responseMessages.FORBIDDEN}` };
        organization = user.organizationData;
        break;
      default:
        break;
    }
  }
  return { isSuccess: true, message: '', organization };
}

const userGenericValidations = async (user, userBody, permission, create = true) => {
  const { findOrganizationById } = require("../organization/organization.service");
  if (permission.scope == scope.GLOBAL) {
    let organizationData;
    if (create && userBody.role !== roleTypes.ADMIN) {
      if (!userBody.admin)
        throw new ApiError(
          status.BAD_REQUEST,
          `${responseMessages.USER_MODULE.CREATE_USER.SELECT_ADMIN}`
        );
      const admin = await getUserById(userBody.admin);
      if (!admin.organizationData)
        throw new ApiError(
          status.BAD_REQUEST,
          `${responseMessages.USER_MODULE.CREATE_USER.ORGANIZATION_NOT_EXIST}`
        );
      if (!admin || admin.role != roleTypes.ADMIN)
        throw new ApiError(
          status.BAD_REQUEST,
          `${responseMessages.USER_MODULE.CREATE_USER.INVALID_ADMIN}`
        );
      organizationData = admin.organizationData;
    }

    if (organizationData) {
      user["organizationData"] = organizationData;
    }

  }
  if (userBody.organization) {
    const organization = await findOrganizationById(userBody.organization);
    if (!organization)
      throw new ApiError(status.BAD_REQUEST, `${responseMessages.CREATE_NEW} ${projectModules.ORGINIZATION}`);
    if (!organization.user)
      throw new ApiError(status.FORBIDDEN, responseMessages.USER_MODULE.CREATE_USER.ORGANIZATION_ERROR)
    // if (organization.user.toString() != user.admin.toString())
    //   throw new ApiError(status.BAD_REQUEST, `${responseMessages.USER_MODULE.CREATE_USER.ORGANIZATION_ERROR}`);
    user["organizationData"] = organization;
  }
  if (permission.scope == scope.TEAM || permission.scope == scope.ORGANIZATION) {
    userBody["admin"] = user.admin ? user.admin : user.id;

  }
  if (permission.scope == scope.ORGANIZATION) {
    userBody["client"] = user.id;
  }
  if (user.organizationData) {
    userBody["organization"] = { id: user.organizationData.id, name: user.organizationData.name };
    userBody["policies"] = user?.organizationData?.policies;
    userBody["leaves"] = user?.organizationData?.leaves;
  }

  if (userBody.client) {
    const client = await getUserById(userBody.client)
    if (!client || client.role != roleTypes.CLIENT)
      throw new ApiError(status.BAD_REQUEST, `${responseMessages.USER_MODULE.CREATE_USER.INVALID_CLIENT}`);
  }

  if (userBody.reportsTo) {
    const user = await getUserById(userBody.reportsTo);
    if (!user)
      throw new ApiError(status.BAD_REQUEST, `Reports to user ${responseMessages.NOT_FOUND}`);
    updateBody["reportsTo"] = { id: user.id, name: user.name, email: user.email };
  }
  if (userBody.role) {
    const role = await findOneRole({ name: userBody.role });
    if (!role)
      throw new ApiError(status.BAD_REQUEST, `Role ${responseMessages.NOT_FOUND}`);

    userBody["rolePermission"] = role.id;
  }
}
const permissionHandler = (user, permission) => {
  let filter;
  let val = false;
  if (permission.scope == scope.GLOBAL)
    val = true
  if (permission.scope == scope.OWN) {
    val = true;
    filter = { _id: user.id };
  }
  if (permission.scope == scope.TEAM) {
    if (user.role == roleTypes.ADMIN)
      filter = { admin: user.id }
    else
      filter = {
        admin: user.admin
      }
    val = true;
  }
  if (permission.scope == scope.ORGANIZATION) {
    filter = { "organization.id": user?.organizationData?.id };
    val = true
  }
  return { addFilter: filter, valid: val };
}

const getAllUsersAtlas = async (filter, options, user, permission, search) => {
  const { addFilter, valid } = permissionHandler(user, permission);
  if (!valid) throw new ApiError(status.BAD_REQUEST, `${responseMessages.FORBIDDEN}`);

  // Combine permission filters with user filters
  const combinedFilter = { ...filter };
  if (addFilter) Object.assign(combinedFilter, addFilter);
  const objectIdKeys = ["organization.id", "reportsTo", "client", "admin", "organization"];
  objectIdParsing(combinedFilter, objectIdKeys);
  // Handle nested field filters
  if (combinedFilter.reportsTo) {
    const reportsTo = combinedFilter.reportsTo;
    delete combinedFilter.reportsTo;
    combinedFilter["reportsTo.id"] = reportsTo;
  }

  if (combinedFilter.organization) {
    const organization = combinedFilter.organization;
    delete combinedFilter.organization;
    combinedFilter["organization.id"] = organization;
  }

  // Set default sorting if not provided
  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc';
  }

  // Use Atlas Search for all queries (with or without search text)
  return await User.atlasSearch(combinedFilter, options, search);
};

const getUserAggregate = async (filter, limit) => {
  const pipeline = [
    {
      '$match': filter
    }, {
      '$lookup': {
        'from': 'organizations',
        'localField': 'organization.id',
        'foreignField': '_id',
        'as': 'organizationData'
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'admin',
        'foreignField': '_id',
        'as': 'adminData'
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'client',
        'foreignField': '_id',
        'as': 'clientData'
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'reportsTo.id',
        'foreignField': '_id',
        'as': 'reportsTo'
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'admin',
        'foreignField': 'admin',
        'pipeline': [
          {
            '$match': {
              'role': 'hr'
            }
          }
        ],
        'as': 'hrData'
      }
    }, {
      '$unwind': {
        'path': '$hrData',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': {
        'path': '$adminData',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': {
        'path': '$clientData',
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': {
        'path': '$reportsTo',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$unwind': {
        'path': '$organizationData',
        'preserveNullAndEmptyArrays': true
      }
    }
  ]
  if (limit)
    pipeline.push({ $limit: limit });

  const result = await User.aggregate(pipeline);
  if (limit == 1)
    return result[0];
  return result
}

const uploadDocuments = async (user, userId, files, body) => {
  const getUser = await getUserById(userId);
  if (!user)
    throw new ApiError(status.BAD_REQUEST, `${responseMessages.USER_MODULE.USER_NOT_FOUND}`);
  let updateData = files.map((file, index) => {
    return { name: body.customNames[index], url: file.location }
  });
  const removeFiles = []
  let userFiles = getUser.documents ? JSON.parse(JSON.stringify(getUser.documents)) : [];

  body?.removeFiles?.forEach((file) => {
    const fileExist = userFiles.find(f => f.url == file)
    if (fileExist) {
      let splitFile = fileExist.url.split("/");
      splitFile = splitFile[splitFile.length - 1];
      removeFiles.push({ Key: "documents/" + splitFile });
      userFiles.splice(userFiles.indexOf(fileExist), 1);
    }
  });

  // if (body.removeFiles)
  // updateData = [...userFiles, ...updateData];
  // if (updateData) {
  updateData = [...userFiles, ...updateData];
  // }
  const result = await userUpdateById(userId, { documents: updateData });
  if (removeFiles?.length) {
    // const result = await S3Util.deleteManyFromS3(removeFiles);
    const s3Remove = await new S3Util(removeFiles, null);
    await s3Remove.deleteManyFromS3();

  }
  return result
}
let filterUsers = async (filter)=>{
  return await User.find(filter)
}

const files = [{ "fieldname": "files", "originalname": "Flux_Dev_Design_a_logo_for_Code_Trick_Solutions_a_software_com_0.jpg", "encoding": "7bit", "mimetype": "image/jpeg", "size": 145920, "bucket": "reviewbucketcodetrick", "key": "documents/ee0a9c9d-fab8-4383-8a68-eb15ad83561a.jpg", "acl": "public-read", "contentType": "image/jpeg", "contentDisposition": null, "contentEncoding": null, "storageClass": "STANDARD", "serverSideEncryption": null, "metadata": { "name": "firstFile" }, "location": "https://reviewbucketcodetrick.s3.ap-south-1.amazonaws.com/documents/ee0a9c9d-fab8-4383-8a68-eb15ad83561a.jpg", "etag": "\"68beb40455b43266a75068b2a2be3f80\"" }, { "fieldname": "files", "originalname": "Logo 1.png", "encoding": "7bit", "mimetype": "image/png", "size": 19635, "bucket": "reviewbucketcodetrick", "key": "documents/216005f8-6d7a-4c8c-b8bf-9af54a3de03e.png", "acl": "public-read", "contentType": "image/png", "contentDisposition": null, "contentEncoding": null, "storageClass": "STANDARD", "serverSideEncryption": null, "metadata": { "name": "Untitled" }, "location": "https://reviewbucketcodetrick.s3.ap-south-1.amazonaws.com/documents/216005f8-6d7a-4c8c-b8bf-9af54a3de03e.png", "etag": "\"098a10e17a31fb99e896da146dd1a26c\"" }]
module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  changePassword,
  getUserByEmailAndRole,
  findOneUser,
  getAllUsers,
  changePasswordAdmin,
  updateOneUser,
  uploadLogo,
  updateUsers,
  profile,
  updateUser,
  findAllUsers,
  findUserById,
  roleChecker,
  getAllUsersAtlas,
  getUserAggregate,
  userUpdateById,
  uploadDocuments,
  filterUsers

};
