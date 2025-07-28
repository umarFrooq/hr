import { isEqual } from "lodash";
import { allowedModulesByRole, DEPARTMENTS, roles } from "./constant";

export const getResponseData = (response) => {
  const data = response?.data?.data || response?.data || response;
  return data;
};

export const getErrorMessage = (error) => {
  const message =
    error?.response?.data?.userMessage ||
    error?.response?.data?.message ||
    error?.message ||
    "An unexpected error occurred";
  return message;
};

export const getParsedUserRoles = (role) => {
  switch (role) {
    case roles.SUPER_ADMIN:
      return "Super Admin";
    case roles.ADMIN:
      return "Admin";
    case roles.HR:
      return "HR";
    case roles.MANAGER:
      return "Manager";
    case roles.EMPLOYEE:
      return "Employee";
    case roles.CLIENT:
      return "Client";
    default:
      return "Unknown Role";
  }
};

export const hasModuleAccess = (userRole, module) => {
  return allowedModulesByRole[userRole]?.includes(module) || false;
};

export const getUpdatedData = (original, updated) => {
  const changes = {};
  for (const key in updated) {
    if (!isEqual(updated[key], original[key])) {
      changes[key] = updated[key];
    }
  }
  return changes;
};

export const getDepartmentLabel = (value) => {
  const department = DEPARTMENTS.find((dept) => dept.value === value);
  return department?.label;
};
