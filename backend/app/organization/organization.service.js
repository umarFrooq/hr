const ApiError = require("../../utils/ApiError");
const { status } = require('http-status');
const { Orginization } = require("../../utils/mongoose/mongoose");
const { responseMessages, projectModules } = require("../../utils/response.message");
const { roleTypes, scope, organizationTypes } = require("../../config/enums");
const { updateUser, updateUsers } = require("../user/user.service");
const { objectIdParsing } = require("../../config/components/general.methods");
const S3Util = require("../../config/s3.file.system");

/**
 * Create an organization
 * @param {Object} orginizationBody - The Orginization's info
 * @param {Object} user - The user who is creating the organization
 * @returns {Promise<Orginization>}
 */
const createOrginization = async (orginizationBody, user, permission) => {
  const valid = organizationAccess(orginizationBody, permission, user);
  if (!valid.success)
    throw new ApiError(status.BAD_REQUEST, valid.message);
  if (valid.data) {
    orginizationBody = { ...orginizationBody, ...valid.data };
  }
  const orginization = await Orginization.create({
    ...orginizationBody,

  });
  if (valid?.data?.orgType == organizationTypes.SUB) {
    await updateUser(orginization.clientId, { organization: { id: orginization.id, name: orginization.name } });
    await updateUsers({ client: orginization.clientId }, { organization: { id: orginization.id, name: orginization.name } });
  } else {
    await updateUsers({ admin: orginization.user.id }, { organization: { id: orginization.id, name: orginization.name } });
    await updateUser(orginization.user.id, { organization: { id: orginization.id, name: orginization.name } });
  }
  return orginization;
}

/**
 * Update an Orginization by Id
 * @param {ObjectId} orginizationId - The ObjectId of Orginization
 * @param {Object} updateBody - The Orginization's info to be updated
 * @param {Object} user - The user who is updating the Orginization
 * @returns {Promise<Orginization>}
 */
const updateOrginizationById = async (orginizationId, updateBody, user, permission) => {

  const organization = await Orginization.findById(orginizationId);
  if (!organization)
    throw new ApiError(status.NOT_FOUND, `${projectModules.ORGINIZATION} ${responseMessages.NOT_FOUND}`);
  updateOrganizationValidation(user, permission, organization);
  Object.assign(organization, updateBody);
  const result = await organization.save();
  updateUsers({ "organization.id": orginizationId }, { leaves: organization.leaves, policies: organization.policies });
  return result;
}

/**
 * Get an Orginization by id
 * @param {ObjectId} orginizationId - The ObjectId of Orginization
 * @returns {Promise<Orginization>}
 */
const getOrginizationById = async (orginizationId, user) => {
  return await orginizationValidation(orginizationId, user);

}

/**
 * Delete an Orginization by Id
 * @param {ObjectId} orginizationId - The ObjectId of the Orginization to be deleted
 * @returns {Promise<Orginization>} The deleted Orginization object
 * @throws {ApiError} If the Orginization is not found
 */

const deleteOrginizationById = async (orginizationId, user) => {
  // await orginizationValidation(orginizationId, user);
  return await Orginization.findByIdAndDelete(orginizationId);
}

/**
 * Get multiple Orginizations by filter and options
 * @param {Object} filter - The MongoDB filter
 * @param {Object} options - The MongoDB options
 * @returns {Promise<QueryResult>} - The QueryResult containing the Orginizations
 */

/**
 * Get all organizations with pagination
 * @param {Object} filter - MongoDB filter to apply
 * @param {Object} options - Query options including pagination and sorting
 * @returns {Promise<QueryResult>} - The paginated query result containing organizations
 */

const getAllOrginizations = async (filter, options, user, permission) => {
  const newFilter = allOrganizationAccess(user, permission);
  if (newFilter)
    Object.assign(filter, newFilter);
  const orginizations = await Orginization.paginate(filter, options);
  return orginizations;
}

/**
 * Validate if the user has the permission to access the organization
 * @param {ObjectId} orginizationId - The ObjectId of the organization
 * @param {Object} user - The user object
 * @returns {Promise<Orginization>} - The organization object
 * @throws {ApiError} If the user does not have permission
 */
const orginizationValidation = async (orginizationId, user) => {
  const orginization = await Orginization.findById(orginizationId);
  // if (user.role != roleTypes.SUPER_ADMIN && user.organization.id.toString() !== orginization.id.toString()) {
  //   throw new ApiError(status.FORBIDDEN, responseMessages.FORBIDDEN);
  // }
  return orginization;
}
/**
 * Find an organization by filter
 * @param {Object} filter - MongoDB filter to apply
 * @returns {Promise<Orginization | null>} - The organization object or null if not found
 */
const findOneOrganization = async (filter) => {
  const organization = await Orginization.findOne(filter);
  return organization;
}

/**
 * Find an organization by id
 * @param {ObjectId} id - The ObjectId of the organization to find
 * @returns {Promise<Orginization | null>} - The organization object or null if not found
 */
const findOrganizationById = async (id) => {
  return await Orginization.findById(id);
}
const organizationAccess = (organizationBody, permission, user) => {
  let response = { message: "", success: true };
  if (permission.scope == scope.GLOBAL) {
    if (!organizationBody.user) {
      response = { message: responseMessages.USER_MODULE.CREATE_USER.SELECT_ADMIN, success: false };
    }

  }
  if (permission.scope == scope.TEAM) {
    response["data"] = { user: user.admin ? user.admin : user.id }
  }
  if (permission.scope == scope.ORGANIZATION) {
    response["data"] = { clientId: user.id, user: user.admin, orgType: organizationTypes.SUB, main: user?.organizationData?.id }
    response["orgType"] = organizationTypes.SUB;
    response["main"] = user?.organizationData?.id
  }
  return response;
}
const updateOrganizationValidation = (user, permission, organization) => {
  if (permission.scope == scope.ORGANIZATION) {
    if (user.id != user?.organizationData?.clientId)
      throw new ApiError(status.BAD_REQUEST, responseMessages.FORBIDDEN);
  }
  if (permission.scope == scope.TEAM) {
    const admin = user.admin ? user.admin : user.id;
    if (admin != organization?.user?.id.toString())
      throw new ApiError(status.BAD_REQUEST, responseMessages.FORBIDDEN);
  }
}

const allOrganizationAccess = (user, permission) => {

  if (permission.scope == scope.TEAM) {
    let userId = user.admin ? user.admin : user.id;
    return { user: userId }
  }
  if (permission.scope == scope.ORGANIZATION) {
    let clientId = user.id;
    return { clientId }
  }

}
const organizationAtlasQuery = async (filter, options, user, permission, search) => {
  const newFilter = allOrganizationAccess(user, permission);
  if (newFilter)
    Object.assign(filter, newFilter);
  // Set default sorting if not provided
  const objectIdKeys = ["user", "main", "clientId"];
  objectIdParsing(filter, objectIdKeys);
  if (!options.sortBy) {
    options.sortBy = 'createdAt:desc';
  }
  const orginizations = await Orginization.atlasSearch(filter, options, search);
  return orginizations;
}

const uploadLogo = async (body, organizationId, files, user, permission) => {
  const organization = await orginizationValidation(organizationId);
  updateOrganizationValidation(user, permission, organization);
  let updateLogo = { logo: null };
  if (!organization) throw new ApiError(status.NOT_FOUND, `${projectModules.ORGANIZATION} ${responseMessages.NOT_FOUND}`);
  let removeImage = body.removeImage;
  if (!files || !files.logo || !files.logo.length)
    if (!body.removeImage)
      throw new ApiError(400, responseMessages.USER_MODULE.UPLOAD_PROFILE.PROFILE_IMAGE);

  if (body?.removeImage && body?.removeImage != organization.logo)
    throw new ApiError(status.BAD_REQUEST, responseMessages.USER_MODULE.UPLOAD_PROFILE.UPDATE_OWN_IMAGE);
  if (organization.logo)
    removeImage = organization.logo;

  if (files?.logo?.length)
    updateLogo = { logo: files.logo[0].location };
  if (body.removeImage) {
    removeImage = body.removeImage;
  }
  if (removeImage) {
    let s3 = new S3Util(removeImage, null);
    await s3.deleteFromS3();
  }
  return await updateOrganization(organizationId, updateLogo)

}
const updateOrganization = async (orginizationId, body) => {
  // await orginizationValidation(orginizationId, user);
  return await Orginization.findByIdAndUpdate(orginizationId, body, { new: true });
}
module.exports = {
  createOrginization,
  updateOrginizationById,
  getOrginizationById,
  deleteOrginizationById,
  getAllOrginizations,
  findOrganizationById,
  organizationAtlasQuery,
  uploadLogo
};  