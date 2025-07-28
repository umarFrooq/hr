import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { CommandItem } from "@/components/ui/command";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { roles } from "@/utils/constant";

const ROLE_LABELS = {
  admin: "Admin",
  hr: "HR",
  manager: "Manager",
  employee: "Employee",
  client: "Client",
  superAdmin: "Super Admin",
};

const ROLE_OPTIONS = Object.entries(roles).map(([key, value]) => ({
  value,
  label: ROLE_LABELS[value] || key.charAt(0).toUpperCase() + key.slice(1),
}));

const RoleDropdownFilter = ({ searchKey = "role", placeholder = "Select" }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(searchParams.get(searchKey) ?? "");
  const authUserRole = useSelector((state) => state.auth?.user?.role);

  // Filter roles by auth user
  let availableOptions = ROLE_OPTIONS.filter((r) => r.value !== roles.SUPER_ADMIN); // No one can see superAdmin
  if (authUserRole !== roles.SUPER_ADMIN) {
    availableOptions = availableOptions.filter((r) => r.value !== roles.ADMIN); // Only super admin can see admin
  }

  // Filter roles by search
  const filteredOptions = search
    ? availableOptions.filter((d) => d.label.toLowerCase().includes(search.toLowerCase()))
    : availableOptions;

  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    if (selected) {
      params[searchKey] = selected;
      setSearchParams(params);
    } else {
      delete params[searchKey];
      setSearchParams(params);
    }
    // eslint-disable-next-line
  }, [selected, searchKey]);

  useEffect(() => {
    setSelected(searchParams.get(searchKey) ?? "");
    // eslint-disable-next-line
  }, [searchParams, searchKey]);

  return (
    <div className="relative w-full max-w-xs">
      <SearchableSelect
        options={filteredOptions}
        value={selected}
        onSelect={setSelected}
        onSearchChange={setSearch}
        placeholder={placeholder}
        searchPlaceholder="Search roles..."
        notFoundText="No roles found"
      />
    </div>
  );
};

export default RoleDropdownFilter;
