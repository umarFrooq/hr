export const getPermissionsMap = (permissions = []) => {
  const map = new Map();
  permissions?.forEach((permission) => {
    map.set(permission.name, permission);
  });
  return Object.fromEntries(map.entries());
};

// export function hasPermission(permissions, resource, action, scope = "any") {
//   return permissions?.some(
//     (perm) => perm.resource === resource && perm.action === action
//     //  && perm.scope === scope
//   );
// }

export const hasPermission = (_permissions, resource, action, _scope = ["any"]) => {
  // Ensure _scope is always an array
  const scopesToCheck = Array.isArray(_scope) ? _scope : [_scope];

  // Always include "any" scope at the beginning for hierarchy
  const scopes = ["any", ...scopesToCheck.filter((scope) => scope !== "any")];

  const permissions = new Map(Object.entries(_permissions));

  // Check if user has permission for any of the specified scopes
  return scopes.some((scope) => {
    const key = `${resource}:${action}:${scope}`;
    return permissions.has(key);
  });
};
