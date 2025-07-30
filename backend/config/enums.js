const organizationRoles = {
  HR: "hr",
  ADMIN: "admin",
  MANAGER: "manager",
  SUPER_ADMIN: "superAdmin"
}
const nonOrganizationRoles = {
  EMPLOYEE: "employee",
  CLIENT: "client",
}
const roleTypes = {
  ...nonOrganizationRoles,
  ...organizationRoles
}
console.log(roleTypes);
const countries = { PAK: "pak" }
const workStatus = {
  REMOTELY: "remotely",
  OFFICE: "office",


}
const roleScope = {
  GLOBAL: 'global',
  CLIENT: 'client',
  ORGANIZATION: 'organization',
  SELF: 'self'
}

const resourceTypes = {
  USERS: 'users',
  ORGANIZATIONS: 'organizations',
  ROLES: "roles",
  PERMISSIONS: "permissions",
  CHECK_IN: "checkin",
  LEAVES: "leaves",
  PROFILE: "profile"
}
const actionTypes = {
  CREATE: 'create',
  READ: 'read',
  DELETE: 'delete',
  UPDATE: 'update'
}
const resourceMethods = {
  POST: actionTypes.CREATE,
  GET: actionTypes.READ,
  DELETE: actionTypes.DELETE,
  PUT: actionTypes.UPDATE,
  PATCH: actionTypes.UPDATE
}
const scope = {
  GLOBAL: 'any',
  TEAM: 'team',
  OWN: 'own',
  ORGANIZATION: 'org'
}

const organizationTypes = {
  SUB: "sub",
  MAIN: "main"
}

const leavesType = {
  SICK: 'sick',
  CASUAL: 'casual',
  ANNUAL: 'annual',
  UNPAID: 'unpaid',
  MATERNITY: 'maternity',
  PATERNITY: 'paternity'
}
const leaveStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELED: "canceled"
}

const currentDate = new Date();
const isoDateString = currentDate.toISOString();
console.log(isoDateString);
module.exports = {
  roleTypes,
  countries,
  organizationRoles,
  nonOrganizationRoles,
  workStatus,
  resourceTypes,
  actionTypes,
  scope,
  resourceMethods,
  organizationTypes,
  leavesType,
  leaveStatus
}