export const getPermissionsMap = (permissions = []) => {
  const map = new Map();
  permissions?.forEach((permission) => {
    map.set(permission.name, permission);
  });
  return Object.fromEntries(map.entries());
};

export const hasPermission = (_permissions, resource, action, _scope = ["any"]) => {
  const scopesToCheck = Array.isArray(_scope) ? _scope : [_scope];
  const scopes = ["any", ...scopesToCheck.filter((scope) => scope !== "any")];

  const permissions = Object.values(_permissions);

  return scopes.some((scope) => {
    return permissions.some(
      (perm) =>
        perm.resource === resource &&
        perm.action === action &&
        perm.scope === scope
    );
  });
};
