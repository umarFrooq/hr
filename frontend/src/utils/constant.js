export const roles = {
  SUPER_ADMIN: "superAdmin",
  ADMIN: "admin",
  HR: "hr",
  MANAGER: "manager",
  EMPLOYEE: "employee",
  CLIENT: "client",
};

export const scope = {
  ANY: "any",
  ORGANIZATION: "org",
  TEAM: "team",
  OWN: "own",
};

export const apiTags = {
  USERS: "Users",
  ORGANIZATIONS: "Organizations",
  ATTENDANCE: "Attendance",
  LEAVES: "Leaves",
};

export const allowedModulesByRole = {
  [roles.SUPER_ADMIN]: [
    "dashboard",
    "users",
    "settings",
    "attendance",
    "leaves",
    "requests",
    "profile",
  ],
  [roles.ADMIN]: ["dashboard", "users", "attendance", "leaves", "requests", "profile"],
  [roles.HR]: ["dashboard", "users", "attendance", "leaves", "requests", "profile"],
  [roles.MANAGER]: ["dashboard", "users", "requests", "profile"],
  [roles.EMPLOYEE]: ["dashboard", "attendance", "leaves", "profile"],
  [roles.CLIENT]: ["dashboard", "profile"],
};

export const DEPARTMENTS = [
  { value: "humanResources", label: "Human Resources (HR)" },
  { value: "financeAccounting", label: "Finance & Accounting" },
  { value: "informationTechnology", label: "Information Technology (IT)" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "customerSupport", label: "Customer Support / Service" },
  { value: "operations", label: "Operations" },
  { value: "administration", label: "Administration" },
  { value: "legalCompliance", label: "Legal / Compliance" },
  { value: "procurementPurchasing", label: "Procurement / Purchasing" },
  { value: "researchDevelopment", label: "Research & Development (R&D)" },
  { value: "productManagement", label: "Product Management" },
  { value: "businessDevelopment", label: "Business Development" },
  { value: "logisticsSupplyChain", label: "Logistics & Supply Chain" },
];

export const leavesType = {
  SICK: "sick",
  CASUAL: "casual",
  ANNUAL: "annual",
  UNPAID: "unpaid",
  MATERNITY: "maternity",
  PATERNITY: "paternity",
};

export const leaveStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};
