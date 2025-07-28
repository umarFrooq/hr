const catchAsync = require("../../utils/catchAsync");
const { status } = require('http-status');
const pick = require("../../utils/pick");
const organizationService = require("./organization.service");

const createOrginization = catchAsync(async (req, res) => {
  const orginization = await organizationService.createOrginization(req.body, req.user, req.permission);
  res.sendStatus(orginization, status.CREATED);
});

const updateOrginizationById = catchAsync(async (req, res) => {
  const orginization = await organizationService.updateOrginizationById(req.params.organizationId, req.body, req.user, req.permission);
  res.sendStatus(orginization);
});

const getOrginizationById = catchAsync(async (req, res) => {
  const orginization = await organizationService.getOrginizationById(req.params.organizationId, req.user);
  if (!orginization) {
    throw new ApiError(status.NOT_FOUND, 'ORGINIZATION_NOT_FOUND');
  }
  res.sendStatus(orginization);
});

const deleteOrginizationById = catchAsync(async (req, res) => {
  const result = await organizationService.deleteOrginizationById(req.params.organizationId, req.user);
  res.sendStatus(result, status.OK);
});

const getAllOrginizations = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user', "clientId", "main", "orgType"]);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const search = pick(req.query, ["name", "value"]);

  const result = await organizationService.organizationAtlasQuery(filter, options, req.user, req.permission, search);
  res.sendStatus(result);
});

const uploadLogo = catchAsync(async (req, res) => {
  const result = await organizationService.uploadLogo(req.body, req.params.organizationId, req.files, req.user, req.permission);
  res.sendStatus(result);
})
module.exports = {
  createOrginization,
  updateOrginizationById,
  getOrginizationById,
  deleteOrginizationById,
  getAllOrginizations,
  uploadLogo
};