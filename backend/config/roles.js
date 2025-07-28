const { roleTypes } = require("./enums");

const roles = Object.values(roleTypes);

const roleRights = new Map();
// Employee
roleRights.set(roles[0], ["updateUsers","profile"]);
// Client
roleRights.set(roles[1], ["getOrganization","updateUsers","getAllUsers","profile"]);
// HR
roleRights.set(roles[2], [
  "createUsers","updateUsers","getAllUsers","profile","deleteUsers",
  // Organization Management 
  "getOrganization", "updateOrganization",""
]);
// Admin
roleRights.set(roles[3], [
  "createUsers","updateUsers","getAllUsers","profile","deleteUsers",
  // Organization Management
  "createOrganization", "getOrganization", "updateOrganization", "deleteOrganization"
]);
// Manager
roleRights.set(roles[4], [
  "createUsers","updateUsers","getAllUsers","profile",
  // Organization Management
  "getOrganization"
]);
// Super Admin
roleRights.set(roles[5], [
  "createUsers","updateUsers","getAllUsers","profile","deleteUsers",
  // Organization Management
  "createOrganization", "getAllOrganizations", "getOrganization", "updateOrganization", "deleteOrganization"
]);

module.exports = {
  roles,
  roleRights
}